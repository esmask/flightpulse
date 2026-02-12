import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const REGION_CONFIG = {
  global: { center: [25, 0], zoom: 3 },
  europe: { center: [50, 10], zoom: 5 },
  kosovo: { center: [42.66, 21.16], zoom: 9 }, // Malo jači zoom za Kosovo
};

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
        <img src="/plane_icon.png" style="width: 32px; height: 32px; filter: drop-shadow(0 0 4px rgba(0,0,0,0.5));" />
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20], 
  });
};

const getAirlineLogo = (callsign) => {
  if (!callsign || callsign.length < 3) return null;
  const code = callsign.substring(0, 3).toUpperCase(); // Većina airline kodova su 3 slova (npr WZZ, THY)
  return `https://images.kiwi.com/airlines/64/${code}.png`;
};

export default function LiveMap({ region, search }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:5000/live-flights");
        setFlights(res.data.states || []);
      } catch (err) {
        console.log("Error loading live flights", err);
      }
      setLoading(false);
    }
    load();
    const refresh = setInterval(load, 5000);
    return () => clearInterval(refresh);
  }, []);

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
    return list.slice(0, 300);
  }, [flights, search]);

  const cfg = REGION_CONFIG[region] || REGION_CONFIG.global;

  if (loading) return <div className="map-loader">Connecting to Global Radar...</div>;

  return (
    <MapContainer
      key={region} 
      center={cfg.center}
      zoom={cfg.zoom}
      scrollWheelZoom={true}
      className="leaflet-container"
      style={{ background: "#060a13" }} 
    >
      <TileLayer 
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
        attribution='&copy; FlightPulse Global'
      />

      {filtered.map((f, i) => {
        const kmh = Math.round((f.speed || 0) * 3.6);
        const heading = f.track || 0;
        const logoUrl = getAirlineLogo(f.callsign);

        return (
          <Marker
            key={f.callsign || i}
            position={[f.lat, f.lon]}
            icon={createRotatedPlaneIcon(heading)}
            eventHandlers={{
              click: () => navigate(`/flight/${f.callsign}`)
            }}
          >
            <Popup className="custom-popup">
              <div style={{ textAlign: "center", minWidth: "140px" }}>
                <img 
                  src={logoUrl} 
                  alt="" 
                  style={{ height: "25px", marginBottom: "8px" }}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#0e76fd" }}>
                  {f.callsign || "UNKNOWN"}
                </div>
                <div style={{ margin: "8px 0", fontSize: "0.85rem", borderTop: "1px solid #eee", paddingTop: "5px" }}>
                  <p>速度: <strong>{kmh} km/h</strong></p>
                  <p>高度: <strong>{Math.round(f.alt || 0)} m</strong></p>
                </div>
                <button 
                  className="popup-btn"
                  onClick={() => navigate(`/flight/${f.callsign}`)}
                >
                  Flight Details
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}