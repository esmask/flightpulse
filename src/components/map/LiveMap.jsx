import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// REGIONS CONFIGURATION
const REGION_CONFIG = {
  global: { center: [25, 0], zoom: 3 },
  europe: { center: [50, 10], zoom: 5 },
  kosovo: { center: [42.66, 21.16], zoom: 8 },
};

// ★ HELPER: Kreira ikonicu koja je rotirana za 'heading' stepeni
const createRotatedPlaneIcon = (heading) => {
  return L.divIcon({
    className: "custom-plane-icon",
    html: `
      <div style="
        transform: rotate(${heading}deg); 
        width: 100%; 
        height: 100%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
      ">
        <img src="/plane_icon.png" style="width: 38px; height: 38px; filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Centar rotacije
  });
};

// ★ HELPER: Nalazi logo aviokompanije na osnovu callsign-a
const getAirlineLogo = (callsign) => {
  if (!callsign || callsign.length < 3) return null;
  // Uzimamo prva 2 slova (IATA) ili 3 slova (ICAO) za logo
  // Kiwi API koristi IATA kodove (npr W6 za Wizz, ali airplanes.live vraća WZZ)
  // Za Hackathon svrhu, koristićemo generički placeholder ako ne nađemo, 
  // ili specifične mapirane ako želiš (kao u Search.jsx).
  // Ovde koristimo jedan trik sa 'airhex' ili 'content.r9cdn.net' ako imaš pristup,
  // ali za free varijantu, Kiwi je najbolji ako imamo IATA kod.
  // Pošto API vraća ICAO (WZZ), logo se možda neće videti za sve, ali za neke hoće.
  
  const code = callsign.substring(0, 2).toUpperCase(); 
  return `https://images.kiwi.com/airlines/64/${code}.png`;
};

export default function LiveMap({ region, search }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // FETCH DATA
  useEffect(() => {
    async function load() {
      // Prvo učitavanje može prikazati loader, posle samo update-uje pozicije
      try {
        const res = await axios.get("http://localhost:5000/live-flights");
        setFlights(res.data.states || []);
      } catch (err) {
        console.log("Error loading live flights", err);
      }
      setLoading(false);
    }

    load();
    
    // Refresh svakih 5 sekundi za glatko pomeranje
    const refresh = setInterval(load, 5000);
    return () => clearInterval(refresh);
  }, []);

  // FILTER LOGIC
  const filtered = useMemo(() => {
    let list = flights.filter(
      (f) => typeof f.lat === "number" && typeof f.lon === "number"
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.callsign?.toLowerCase().includes(q)
      );
    }

    // Limitiramo na 300 aviona da ne "ugušimo" browser
    return list.slice(0, 300);
  }, [flights, search]);

  const cfg = REGION_CONFIG[region] || REGION_CONFIG.global;

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading Radar...</div>;

  return (
    <MapContainer
      key={region} // Ovo forsira re-render kad se promeni region (da centrira mapu)
      center={cfg.center}
      zoom={cfg.zoom}
      scrollWheelZoom={true}
      className="leaflet-container"
      style={{ background: "#060a13" }} // Tamna pozadina dok se pločice ne učitaju
    >
      {/* Dark Mode Mapa (CartoDB DarkMatter) - Mnogo bolje izgleda za radar! */}
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {filtered.map((f, i) => {
        const kmh = Math.round((f.speed || 0) * 3.6);
        const heading = f.track || 0;
        const logoUrl = getAirlineLogo(f.callsign);

        return (
          <Marker
            key={f.callsign || i} // Bolje koristiti callsign kao key ako je unique
            position={[f.lat, f.lon]}
            icon={createRotatedPlaneIcon(heading)}
            eventHandlers={{
              click: () => navigate(`/flight/${f.callsign}`)
            }}
          >
            <Popup className="custom-popup">
              <div style={{ textAlign: "center" }}>
                {/* Logo u Popup-u */}
                <img 
                  src={logoUrl} 
                  alt="Airline" 
                  style={{ height: "30px", marginBottom: "5px", display: "block", margin: "0 auto" }}
                  onError={(e) => e.target.style.display = 'none'} // Sakrij ako nema loga
                />
                
                <strong style={{ fontSize: "1.1rem", color: "#0e76fd" }}>
                  {f.callsign || "N/A"}
                </strong>
                
                <div style={{ marginTop: "6px", fontSize: "0.9rem", color: "#333", lineHeight: "1.4" }}>
                  🚀 {kmh} km/h <br />
                  📡 {Math.round(f.alt || 0)} m <br />
                  🧭 {Math.round(heading)}°
                </div>
                
                <button 
                  style={{
                    marginTop: "8px",
                    background: "#0e76fd",
                    color: "white",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.8rem"
                  }}
                  onClick={() => navigate(`/flight/${f.callsign}`)}
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}