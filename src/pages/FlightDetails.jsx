import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FlightDetails.css";

// HELPER: Rotirana ikonica aviona
const createRotatedPlaneIcon = (heading) => {
  return L.divIcon({
    className: "custom-plane-icon",
    html: `
      <div style="
        transform: rotate(${heading - 45}deg); 
        width: 100%; 
        height: 100%; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        filter: drop-shadow(0 0 10px rgba(14, 118, 253, 0.8));
      ">
        <img src="/plane_icon.png" style="width: 45px; height: 45px;" />
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
};

// HELPER: Logo aviokompanije
const getAirlineLogo = (callsign) => {
  if (!callsign) return null;
  const prefix = callsign.slice(0, 2).toUpperCase();
  return `https://images.kiwi.com/airlines/64/${prefix}.png`;
};

// 1. MAPA IMENA KOMPANIJA
const airlineMap = {
  WZZ: "Wizz Air", RYR: "Ryanair", AUA: "Austrian",
  Lufthansa: "Lufthansa", SWR: "Swiss", BAW: "British Airways",
  THY: "Turkish Airlines", EZY: "EasyJet", AFR: "Air France",
  JAT: "Air Serbia", DLH: "Lufthansa", UAE: "Emirates"
};

// 2. NOVA MAPA DRŽAVA (Ime -> Kod)
const countryToCode = {
  "Austria": "AT",
  "Germany": "DE",
  "United Kingdom": "GB",
  "Switzerland": "CH",
  "Turkey": "TR",
  "France": "FR",
  "Italy": "IT",
  "Spain": "ES",
  "Hungary": "HU",
  "Ireland": "IE",
  "Serbia": "RS",
  "United Arab Emirates": "AE",
  "United States": "US",
  "Kosovo": "XK"
};

// 3. FUNKCIJA ZA ZASTAVU
const getFlagUrl = (countryName) => {
  if (!countryName) return null;
  
  // Specijalno za Kosovo (jer flagsapi zeza za XK)
  if (countryName === "Kosovo") return "https://flagcdn.com/w80/xk.png";

  // Za ostale nadji kod
  const code = countryToCode[countryName];
  
  if (code) {
    return `https://flagsapi.com/${code}/flat/64.png`;
  }
  
  // Fallback (ako ne nadjemo drzavu, ne prikazuj nista ili stavi neku default ikonicu)
  return null; 
};

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [flight, setFlight] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const mapRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`http://localhost:5000/flight/${id}`);
        
        if (res.data.found) {
          const f = res.data.flight;
          setFlight(f);
          
          // Generisanje putanje
          setHistory(prev => {
            if (prev.length > 0) {
              return [...prev, [f.lat, f.lon]].slice(-50);
            } else {
              const fakePath = [];
              const headingRad = (f.track - 180) * (Math.PI / 180);
              
              for (let i = 20; i > 0; i--) {
                fakePath.push([
                  f.lat + (i * 0.002 * Math.cos(headingRad)), 
                  f.lon + (i * 0.002 * Math.sin(headingRad))
                ]);
              }
              fakePath.push([f.lat, f.lon]);
              return fakePath;
            }
          });
        }
      } catch (err) {
        console.error("Error fetching flight details");
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 3000); 
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (flight && mapRef.current) {
      mapRef.current.flyTo([flight.lat, flight.lon], mapRef.current.getZoom());
    }
  }, [flight]);

  if (loading) return <div className="fd-loading"><div className="loader-spinner"></div> Loading Telemetry...</div>;

  if (!flight) return (
    <div className="fd-error">
      <h2>Flight Lost</h2>
      <p>The signal was lost or the flight has landed.</p>
      <button onClick={() => navigate("/search")}>Back to Radar</button>
    </div>
  );

  const logo = getAirlineLogo(flight.callsign);
  const airlineName = airlineMap[flight.callsign.slice(0,3)] || "International Airline";
  const speedKmh = Math.round((flight.speed || 0) * 3.6);
  const altitude = Math.round(flight.alt || 0);
  
  // Ovde pozivamo funkciju za zastavu
  const flagUrl = getFlagUrl(flight.country);

  return (
    <div className="flight-details-page">
      
      {/* HEADER */}
      <div className="fd-header">
        <div className="fd-identity">
          <div className="fd-logo-box">
             <img src={logo} alt="Airline" onError={(e) => e.target.style.display='none'} />
          </div>
          <div>
            <h1>{flight.callsign}</h1>
            <span className="fd-airline">{airlineName}</span>
          </div>
        </div>

        <div className="fd-status">
          <div className="live-indicator">
            <span className="blink">●</span> LIVE TRACKING
          </div>
          <button className="close-btn" onClick={() => navigate("/search")}>✕ CLOSE</button>
        </div>
      </div>

      <div className="fd-content">
        
        {/* LEVO: INSTRUMENTI */}
        <div className="fd-dashboard">
          
          <div className="fd-card">
            <h3>Ground Speed</h3>
            <div className="gauge-value">{speedKmh} <span className="unit">km/h</span></div>
            <div className="progress-bar">
              <div className="progress-fill speed" style={{width: `${Math.min(speedKmh / 10, 100)}%`}}></div>
            </div>
          </div>

          <div className="fd-card">
            <h3>Altitude</h3>
            <div className="gauge-value">{altitude} <span className="unit">m</span></div>
            <div className="progress-bar">
              <div className="progress-fill alt" style={{width: `${Math.min(altitude / 120, 100)}%`}}></div>
            </div>
          </div>

          <div className="fd-card">
            <h3>Navigation</h3>
            <div className="nav-row">
              <span>Heading:</span> <strong>{Math.round(flight.track)}°</strong>
            </div>
            <div className="nav-row">
              <span>Lat:</span> <strong>{flight.lat.toFixed(4)}</strong>
            </div>
            <div className="nav-row">
              <span>Lon:</span> <strong>{flight.lon.toFixed(4)}</strong>
            </div>
          </div>

           {/* COUNTRY (Sada sa ispravnom zastavom) */}
           <div className="fd-card flag-card">
            <h3>Origin / Region</h3>
            <div className="country-display">
                {flagUrl && <img src={flagUrl} alt="Flag" onError={(e) => e.target.style.display='none'} />}
                <span>{flight.country}</span>
            </div>
          </div>

        </div>

        {/* DESNO: MAPA */}
        <div className="fd-map-container">
          <MapContainer 
            center={[flight.lat, flight.lon]} 
            zoom={10} 
            className="fd-map"
            zoomControl={false}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <Polyline positions={history} color="#00e5ff" weight={4} opacity={0.6} dashArray="10, 10" />
            <Circle center={[flight.lat, flight.lon]} radius={5000} pathOptions={{ color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 0.1 }} />
            <Marker position={[flight.lat, flight.lon]} icon={createRotatedPlaneIcon(flight.track)}>
              <Popup className="fd-popup">
                <strong>{flight.callsign}</strong>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}