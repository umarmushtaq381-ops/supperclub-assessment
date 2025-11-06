# SupperClub – Smart Offer Recommendation

## Overview
A **full-stack technical assessment** built with:
- **NestJS** (backend API)
- **Next.js** (frontend UI)

The system recommends **3 personalized dining offers** to a user based on:
- User preferences
- Current location (browser geolocation)
- Past booking history
- AI-powered ranking using **OpenAI (`gpt-4o-mini`)**

---

## Project Structure
SuperClub/
├── backend/          → NestJS API (Node.js + TypeScript)
├── frontend/         → Next.js App (React + TypeScript)
└── README.md         ← This file

---

## Features Implemented

| Requirement | Status |
|-----------|--------|
| `GET /offers/recommend/:userId` endpoint | Done |
| Return exactly 3 recommendations | Done |
| Use mock data (`users.json`, `offers.json`, `bookings.json`) | Done |
| Location-based filtering (latitude/longitude) | Done |
| Calculate distance using `geolib` | Done |
| Mark previously booked offers + show last booking date | Done |
| OpenAI-powered recommendation logic | Done |
| Fallback: sort by distance if AI fails | Done |
| Clean architecture (modules, services, DTOs, validation) | Done |
| Frontend: user dropdown + geolocation + fetch button | Done |
| Display title, description, distance, booked status | Done |
| CORS enabled for frontend | Done |

---

## How to Run

### 1. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev

API runs on: http://localhost:3000
Test API
http://localhost:3000/offers/recommend/1?lat=25.2048&lng=55.2708

### 2. Frontend (Next.js)
cd frontend
npm install
npm run dev

UI runs on: http://localhost:3001/recommendations
Test Flow

Open the link above
Select Ali or Sara
Allow location access
Click "Get Recommendations"
See 3 offer cards with distance & booking status

Recommendation Logic

Load mock data from src/data/*.json
Calculate distance from user’s current location to each offer
Check booking history for the user
Send structured prompt to OpenAI:
Rank top 3 offers by:
- User preferences
- Proximity
- Avoid already booked
Return JSON only.
Fallback: If OpenAI fails → sort by distance

Layer,Technology
Backend,"NestJS, TypeScript, OpenAI SDK, geolib"
Frontend,"Next.js (App Router), React, TypeScript"
Data,Local JSON files
Validation,class-validator + class-transformer
Config,@nestjs/config + .env

Environment Setup
Add OpenAI Key
Create backend/.env:
OPENAI_API_KEY=sk-your-real-key-here

Mock Data (Sample)
backend/src/data/users.json
[
  { "id": 1, "name": "Ali", "preferences": ["Italian", "Seafood"], "location": { "latitude": 25.2048, "longitude": 55.2708 } },
  { "id": 2, "name": "Sara", "preferences": ["Indian", "Vegan"], "location": { "latitude": 24.4539, "longitude": 54.3773 } }
]
offers.json, bookings.json also included.

API Response Example
{
  "userId": 1,
  "location": { "lat": 25.2048, "lng": 55.2708 },
  "recommendations": [
    {
      "title": "La Piazza Dinner",
      "description": "Authentic pasta and pizza.",
      "distance": "1.2 km",
      "bookedPreviously": true,
      "lastBookingDate": "2024-09-15"
    },
    {
      "title": "Cafe Milano Brunch",
      "description": "Italian brunch experience.",
      "distance": "2.1 km",
      "bookedPreviously": false,
      "lastBookingDate": null
    },
    {
      "title": "Ocean Breeze Seafood Night",
      "description": "Fresh seafood buffet.",
      "distance": "3.5 km",
      "bookedPreviously": false,
      "lastBookingDate": null
    }
  ]
}

