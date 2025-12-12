import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const LIVE_API = "https://api.airplanes.live/v2/state/all";
const RAPID_HOST = "aerodatabox.p.rapidapi.com";
const RAPID_KEY = "78acb83b19msh56397fbb3a839a9p1a8170jsnb07b971ede10";

// ★ MOCK DATA - OVO SPAŠAVA STVAR AKO API PUKNE ★
// Ovi podaci će se prikazati ako pravi API ne radi.
const MOCK_FLIGHTS = [
  { callsign: "WZZ123", lat: 42.6629, lon: 21.1655, velocity: 250, baro_altitude: 1000, heading: 90, origin_country: "Kosovo" },
  { callsign: "WZZ456", lat: 41.9981, lon: 21.4254, velocity: 220, baro_altitude: 1200, heading: 180, origin_country: "Hungary" },
  { callsign: "AUA772", lat: 48.1103, lon: 16.5697, velocity: 200, baro_altitude: 900, heading: 270, origin_country: "Austria" },
  { callsign: "SWR100", lat: 47.4502, lon: 8.5619, velocity: 240, baro_altitude: 5000, heading: 45, origin_country: "Switzerland" },
  { callsign: "DLH999", lat: 50.0379, lon: 8.5622, velocity: 260, baro_altitude: 6000, heading: 120, origin_country: "Germany" },
  { callsign: "TK101", lat: 41.2768, lon: 28.7293, velocity: 230, baro_altitude: 4000, heading: 130, origin_country: "Turkey" },
  { callsign: "BAW555", lat: 51.4700, lon: -0.4543, velocity: 210, baro_altitude: 3000, heading: 200, origin_country: "United Kingdom" },
  { callsign: "AFR202", lat: 49.0097, lon: 2.5479, velocity: 215, baro_altitude: 3500, heading: 190, origin_country: "France" },
  { callsign: "EZY888", lat: 45.4642, lon: 9.1900, velocity: 190, baro_altitude: 2000, heading: 100, origin_country: "United Kingdom" },
  { callsign: "RYR404", lat: 53.4264, lon: -6.2499, velocity: 180, baro_altitude: 1500, heading: 50, origin_country: "Ireland" },
  { callsign: "JAT300", lat: 44.8184, lon: 20.3091, velocity: 205, baro_altitude: 2200, heading: 160, origin_country: "Serbia" },
  { callsign: "UAE50", lat: 25.2532, lon: 55.3657, velocity: 300, baro_altitude: 10000, heading: 90, origin_country: "United Arab Emirates" }
];

// Helper za formatiranje
function normalizeFlights(states) {
  if (!states) return [];
  return states.map((f) => ({
    callsign: f.callsign?.trim() || "N/A",
    lat: f.lat || f[6] || null, // Podržava oba formata
    lon: f.lon || f[5] || null,
    speed: f.velocity || f[9] || 0,
    alt: f.baro_altitude || f[13] || 0,
    track: f.heading || f[10] || 0,
    country: f.origin_country || f[2] || "Unknown",
  }));
}

/* ============================================================
   1) LIVE FLIGHTS (Sa MOCK FALLBACK-om)
============================================================ */
app.get("/live-flights", async (req, res) => {
  try {
    console.log("Fetching live data...");
    // Smanjio sam timeout na 4s da brže prebaci na mock ako koči
    const response = await axios.get(LIVE_API, { timeout: 4000 });
    
    // Provera da li ima podataka
    if (!response.data || !response.data.states || response.data.states.length === 0) {
      throw new Error("Empty API response");
    }

    console.log(`✅ Success! Found ${response.data.states.length} flights.`);
    return res.json({ states: normalizeFlights(response.data.states), source: "live" });

  } catch (err) {
    console.log("⚠️ API Failed or Empty. Switching to MOCK DATA.");
    // Vraćamo lažne podatke tako da sajt UVEK radi
    // Pretvaramo mock format u format koji frontend očekuje
    const mockNormalized = MOCK_FLIGHTS.map(f => ({
        callsign: f.callsign,
        lat: f.lat,
        lon: f.lon,
        speed: f.velocity,
        alt: f.baro_altitude,
        track: f.heading,
        country: f.origin_country
    }));
    
    return res.json({ states: mockNormalized, source: "mock", offline: true });
  }
});

/* ============================================================
   2) AIRPORT SEARCH
============================================================ */
app.get("/airports", async (req, res) => {
  const query = req.query.search;
  if (!query) return res.json([]);

  try {
    const response = await axios.get(`https://${RAPID_HOST}/airports/search/term`, {
      params: { q: query, limit: 10 },
      headers: {
        "x-rapidapi-key": RAPID_KEY,
        "x-rapidapi-host": RAPID_HOST,
      },
    });
    return res.json(response.data.items || []);
  } catch (err) {
    console.error("Airport API Error");
    return res.json([]); 
  }
});

/* ============================================================
   3) SINGLE FLIGHT
============================================================ */
app.get("/flight/:id", async (req, res) => {
  const id = req.params.id.toUpperCase();

  // Prvo tražimo u Mock podacima (brže je)
  let match = MOCK_FLIGHTS.find(f => f.callsign === id);
  
  if (match) {
    return res.json({ 
      found: true, 
      flight: {
        callsign: match.callsign,
        lat: match.lat,
        lon: match.lon,
        speed: match.velocity,
        alt: match.baro_altitude,
        track: match.heading,
        country: match.origin_country
      }
    });
  }

  // Ako nema u mock, probaj live (ali verovatno će failovati ako live ne radi)
  try {
    const response = await axios.get(LIVE_API, { timeout: 3000 });
    const flights = normalizeFlights(response.data.states);
    match = flights.find(f => f.callsign === id);

    if (match) return res.json({ found: true, flight: match });
  } catch (e) {
    // ignore
  }

  return res.json({ found: false });
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});