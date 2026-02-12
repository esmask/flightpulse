import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());

const RAPID_KEY = process.env.RAPIDAPI_KEY;
const RAPID_HOST = "aerodatabox.p.rapidapi.com";

const PRISHTINA_MOCK = [
  { callsign: "WZZ123", origin: "PRN", destination: "FMM", country: "Kosovo", speed: 850, lat: 42.66, lon: 21.16, track: 310, alt: 10000 },
  { callsign: "THY456", origin: "IST", destination: "PRN", country: "Turkey", speed: 880, lat: 41.50, lon: 23.50, track: 280, alt: 9000 },
  { callsign: "AUA772", origin: "VIE", destination: "PRN", country: "Austria", speed: 820, lat: 43.11, lon: 20.56, track: 150, alt: 7500 },
  { callsign: "EDW244", origin: "ZRH", destination: "PRN", country: "Switzerland", speed: 840, lat: 47.45, lon: 8.56, track: 120, alt: 11000 },
  { callsign: "EJU551", origin: "PRN", destination: "BER", country: "Germany", speed: 830, lat: 45.36, lon: 15.50, track: 340, alt: 10500 },
  { callsign: "WZZ992", origin: "PRN", destination: "LTN", country: "United Kingdom", speed: 860, lat: 48.87, lon: 10.37, track: 300, alt: 10000 },
  { callsign: "SAS332", origin: "OSL", destination: "PRN", country: "Norway", speed: 810, lat: 50.18, lon: 14.10, track: 170, alt: 11000 },
  { callsign: "DLH112", origin: "FRA", destination: "PRN", country: "Germany", speed: 845, lat: 49.03, lon: 12.53, track: 145, alt: 9500 },
  { callsign: "TRA667", origin: "AMS", destination: "PRN", country: "Netherlands", speed: 825, lat: 51.31, lon: 4.76, track: 130, alt: 10000 },
  { callsign: "PGR404", origin: "PRN", destination: "IST", country: "Turkey", speed: 870, lat: 40.97, lon: 28.81, track: 110, alt: 9800 }
];

app.get("/live-flights", async (req, res) => {
  try {
    const response = await axios.get("https://api.airplanes.live/v2/state/all", { timeout: 3000 });
    const ac = response.data.ac || [];
    const realFlights = ac.slice(0, 50).map(f => ({
      callsign: f.flight?.trim() || "N/A",
      lat: f.lat, lon: f.lon,
      speed: Math.round((f.gs || 0) * 1.852),
      country: f.re || "International",
      origin: "---", destination: "---"
    }));
    res.json({ states: [...PRISHTINA_MOCK, ...realFlights] });
  } catch (err) { res.json({ states: PRISHTINA_MOCK }); }
});

// POPRAVLJENA RUTA ZA DETALJE (Samo jedna sme da postoji)
app.get("/flight/:id", async (req, res) => {
  const flightId = req.params.id.replace(/\s+/g, '').toUpperCase(); 
  try {
    const response = await axios.get("https://api.airplanes.live/v2/state/all", { timeout: 10000 });
    const ac = response.data.ac || [];
    const found = ac.find(f => f.flight?.trim().replace(/\s+/g, '').toUpperCase() === flightId);

    if (found) {
      const mock = PRISHTINA_MOCK.find(m => m.callsign.toUpperCase() === flightId);
      return res.json({
        found: true,
        flight: {
          callsign: found.flight.trim(),
          lat: found.lat, lon: found.lon,
          speed: found.gs || 0,
          alt: Math.round((found.alt_baro || 0) * 0.3048),
          track: found.track || 0,
          country: found.re || "International",
          origin: mock ? mock.origin : "---",
          destination: mock ? mock.destination : "PRN"
        }
      });
    }
    const mock = PRISHTINA_MOCK.find(f => f.callsign.toUpperCase() === flightId);
    res.json(mock ? { found: true, flight: mock } : { found: false });
  } catch (err) {
    const mock = PRISHTINA_MOCK.find(f => f.callsign.toUpperCase() === flightId);
    res.json(mock ? { found: true, flight: mock } : { found: false });
  }
});

app.get("/airports", async (req, res) => {
  const query = req.query.search;
  if (!query) return res.json([]);
  try {
    const response = await axios.get(`https://${RAPID_HOST}/airports/search/term`, {
      params: { q: query, limit: 10 },
      headers: { "x-rapidapi-key": RAPID_KEY, "x-rapidapi-host": RAPID_HOST }
    });
    res.json(response.data.items || []);
  } catch (err) { res.status(500).json({ error: "API limit" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));