import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Airports.css";
import airportHero from "../assets/airport.jpg";

const pinIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function Airports() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ★ FUNKCIJA KOJA POPRAVLJA ZASTAVU
// ★ NOVA PAMETNA FUNKCIJA ZA ZASTAVE
  function getFlag(countryCode) {
    if (!countryCode) return null;
    let code = countryCode.toUpperCase();
    
    // 1. KOSOVO FIX: flagsapi puca za XK, zato koristimo flagcdn.com
    if (code === "KS" || code === "XK") {
      return "https://flagcdn.com/w80/xk.png";
    }

    // 2. UK FIX
    if (code === "UK") code = "GB";

    // 3. Za sve ostale koristi flagsapi (jer su lepše ikonice)
    return `https://flagsapi.com/${code}/flat/64.png`;
  }
  
  async function searchAirport() {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`http://localhost:5000/airports?search=${query}`);
      const data = await res.json();

      if (!data || data.length === 0) {
        setError("No airports found. Try specific city or IATA.");
        setResult(null);
      } else {
        const airport = data[0];
        setResult({
          name: airport.name,
          iata: airport.iata || "N/A",
          city: airport.municipalityName || airport.city || "Unknown",
          country: airport.countryCode || "Unknown", // Ovo je obično 2 slova (npr KS, DE)
          lat: airport.location?.lat,
          lon: airport.location?.lon
        });
      }
    } catch (err) {
      setError("Server error. Check backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="airports-page">
      {/* HERO */}
      <div className="airports-hero" style={{ backgroundImage: `url(${airportHero})` }}>
        <div className="hero-overlay"></div>
        <p className="hero-sub">AIRPORT DATABASE</p>
        <h1 className="hero-title">Search Airports</h1>
        <div className="airport-search-bar">
          <input
            type="text"
            placeholder="Search (e.g. Prishtina, JFK)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchAirport()}
          />
          <button onClick={searchAirport}>{loading ? "..." : "Search"}</button>
        </div>
      </div>

      {/* REZULTATI */}
      <div className="airport-results">
        {error && <p className="error-msg">{error}</p>}

        {result && (
          <div className="airport-card">
            <div className="card-info">
              <div className="iata-badge">{result.iata}</div>
              <h2 className="airport-name">{result.name}</h2>
              <div className="airport-location">
                
                {/* ★ OVDE KORISTIMO POPRAVLJENU ZASTAVU */}
                <img 
                  src={getFlag(result.country)} 
                  alt="flag" 
                  className="flag-icon"
                  onError={(e) => e.target.style.display = 'none'} 
                />
                
                <span>{result.city}, {result.country}</span>
              </div>
              <div className="coords">📍 GPS: {result.lat?.toFixed(4)}, {result.lon?.toFixed(4)}</div>
            </div>

            <div className="card-map">
              {result.lat && result.lon ? (
                <MapContainer key={result.iata} center={[result.lat, result.lon]} zoom={12} className="mini-map" zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[result.lat, result.lon]} icon={pinIcon}><Popup>{result.name}</Popup></Marker>
                </MapContainer>
              ) : <div className="no-map">No Map Data</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}