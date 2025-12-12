import axios from "axios";

// === LIVE FLIGHTS VIA BACKEND ===
export async function getLiveFlights() {
  try {
    const { data } = await axios.get("http://localhost:5000/live-flights");

    // airplanes.live → data.states
    if (Array.isArray(data.states)) {
      return data.states.map((f) => ({
        callsign: f.callsign,
        lat: f.lat,
        lon: f.lon,
        speed: f.speed,
        heading: f.track,
        altitude: f.alt,
      }));
    }

    return [];
  } catch (err) {
    console.log("LIVE API ERROR:", err);
    return [];
  }
}

// === RAPIDAPI SETTINGS ===
const RAPID_KEY = "78acb83b19msh56397fbb3a839a9p1a8170jsnb07b971ede10";
const RAPID_HOST = "aerodatabox.p.rapidapi.com";

// === 1) AIRPORT SEARCH ===
export async function searchAirportByName(query) {
  if (!query.trim()) return [];

  try {
    const res = await axios.get(
      `https://${RAPID_HOST}/airports/search/term`,
      {
        params: { q: query, limit: 10 },
        headers: {
          "x-rapidapi-key": RAPID_KEY,
          "x-rapidapi-host": RAPID_HOST,
        },
      }
    );

    return res.data.items || [];
  } catch (err) {
    console.log("Airport search error:", err);
    return [];
  }
}

// === 2) AIRPORT DETAILS BY IATA ===
export async function getAirportDetails(iata) {
  try {
    const res = await axios.get(
      `https://${RAPID_HOST}/airports/iata/${iata}`,
      {
        headers: {
          "x-rapidapi-key": RAPID_KEY,
          "x-rapidapi-host": RAPID_HOST,
        },
      }
    );

    return res.data || null;
  } catch (err) {
    console.log("Airport details error:", err);
    return null;
  }
}

// === 3) FLIGHT DETAILS (RAPIDAPI VERSION) ===
export async function getFlightDetails(iataNumber) {
  if (!iataNumber) return null;

  const RAPID_KEY = "78acb83b19msh56397fbb3a839a9p1a8170jsnb07b971ede10";
  const RAPID_HOST = "aerodatabox.p.rapidapi.com";

  try {
    const res = await axios.get(
      `https://${RAPID_HOST}/flights/number/${iataNumber}`,
      {
        headers: {
          "x-rapidapi-key": RAPID_KEY,
          "x-rapidapi-host": RAPID_HOST,
        },
        params: {
          withAircraftImage: true,
          withLocation: true,
        },
      }
    );

    // API vraća listu — uzmi prvi flight ako postoji
    return res.data[0] || null;

  } catch (err) {
    console.log("Flight details error:", err.response?.data || err);
    return null;
  }
}
