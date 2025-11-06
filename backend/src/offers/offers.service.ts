import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getDistance } from 'geolib';
import OpenAI from 'openai';

@Injectable()
export class OffersService {
  private openai: OpenAI;
  private users: any[];
  private offers: any[];
  private bookings: any[];

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });

    const dataPath = join(__dirname, '..', 'data');
    this.users = JSON.parse(readFileSync(join(dataPath, 'users.json'), 'utf8'));
    this.offers = JSON.parse(readFileSync(join(dataPath, 'offers.json'), 'utf8'));
    this.bookings = JSON.parse(readFileSync(join(dataPath, 'bookings.json'), 'utf8'));
  }

  async recommendOffers(userId: number, userLocation?: { lat: number; lng: number }) {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new NotFoundException('User not found');

    const location = userLocation ?? user.location;

    const userBookings = this.bookings.filter(b => b.userId === userId);

    // Calculate distance for all offers
    const offersWithDistance = this.offers.map(offer => {
      const dist = getDistance(
        { latitude: location.lat, longitude: location.lng },
        { latitude: offer.location.latitude, longitude: offer.location.longitude },
      ) / 1000; // km

      const booking = userBookings.find(b => b.offerId === offer.id);
      return {
        title: offer.title,
        description: offer.description,
        distance: `${dist.toFixed(1)} km`,
        bookedPreviously: !!booking,
        lastBookingDate: booking?.date ?? null,
      };
    });

    // ---- OpenAI Prompt ----
    const prompt = `
User preferences: ${user.preferences.join(', ')}
Location: ${location.lat}, ${location.lng}
Past bookings: ${userBookings.map(b => b.offerId).join(', ') || 'none'}

Available offers with distance:
${JSON.stringify(offersWithDistance, null, 2)}

Return **exactly** a JSON array of the top 3 recommended offers with these fields:
- title
- description
- distance
- bookedPreviously
- lastBookingDate

No extra text, no markdown, just valid JSON array.
`.trim();

    let recommendations: any[] = [];

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      // Safely extract content
      const content = completion.choices?.[0]?.message?.content?.trim();

      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          recommendations = parsed.slice(0, 3); // Ensure max 3
        }
      }
    } catch (error) {
      console.warn('OpenAI failed or returned invalid JSON. Using fallback.', error);
    }

    // Fallback: if no valid AI recommendations, sort by distance
    if (recommendations.length === 0) {
      recommendations = offersWithDistance
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 3);
    }

    return {
      userId,
      location: { lat: location.lat, lng: location.lng },
      recommendations,
    };
  }
}