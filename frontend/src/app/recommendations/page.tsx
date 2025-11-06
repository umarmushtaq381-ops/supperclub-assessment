"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface Offer {
  title: string;
  description: string;
  distance: string;
  bookedPreviously: boolean;
  lastBookingDate: string | null;
}

interface ApiResponse {
  userId: number;
  location: { lat: number; lng: number };
  recommendations: Offer[];
}

const USERS: User[] = [
  { id: 1, name: "Ali" },
  { id: 2, name: "Sara" },
];

export default function RecommendationsPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Offer[] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError("Location failed: " + err.message);
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  const fetchRecommendations = async () => {
    if (!selectedUserId || !location) return;

    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const url = `http://localhost:3000/offers/recommend/${selectedUserId}?lat=${location.lat}&lng=${location.lng}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setRecommendations(data.recommendations);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Smart Offer Recommendation</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>Select user: </label>
        <select
          value={selectedUserId ?? ""}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
          style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
        >
          <option value="" disabled>-- Choose --</option>
          {USERS.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Location:</strong>{" "}
        {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "detecting…"}
      </div>

      <button
        onClick={fetchRecommendations}
        disabled={!selectedUserId || !location || loading}
        style={{
          padding: "0.5rem 1rem",
          background: selectedUserId && location && !loading ? "#0066cc" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {loading ? "Loading…" : "Get Recommendations"}
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {recommendations && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Top 3 Recommendations</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {recommendations.map((offer, i) => (
              <li
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.5rem" }}>{offer.title}</h3>
                <p style={{ margin: "0 0 0.5rem", color: "#555" }}>
                  {offer.description}
                </p>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  Distance: {offer.distance}
                </p>
                {offer.bookedPreviously && (
                  <p style={{ margin: "0.25rem 0 0", color: "#d9534f" }}>
                    Booked on {offer.lastBookingDate}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}