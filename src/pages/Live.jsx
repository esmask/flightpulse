import { useState, useEffect } from "react";
import LiveMap from "../components/map/LiveMap";
import axios from "axios"; // Proveri da li imaš axios instaliran
import "./Live.css";
import { FaCloudSun, FaClock, FaMapMarkerAlt } from "react-icons/fa";

export default function Live() {
  const [region, setRegion] = useState("kosovo"); 
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState("--"); // Početna vrednost dok ne učita

  // 1. SAT (Uživo)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. VREME (Uživo za Prištinu)
  useEffect(() => {
    async function fetchWeather() {
      try {
        // Pozivamo besplatan API za koordinate Prištine
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast?latitude=42.6675&longitude=21.1662&current_weather=true"
        );
        const temp = Math.round(response.data.current_weather.temperature);
        setWeather(temp);
      } catch (error) {
        console.error("Greška pri preuzimanju vremena:", error);
        setWeather("12"); // Fallback ako API ne radi
      }
    }

    fetchWeather();
    // Osveži temperaturu svakih 15 minuta
    const weatherTimer = setInterval(fetchWeather, 900000);
    return () => clearInterval(weatherTimer);
  }, []);

  return (
    <main className="live-page">
      <div className="live-header">
        <div>
          <h1 className="live-title">Live Global Flights</h1>
          <p className="live-sub">Real-time world aviation updates.</p>
        </div>

        <div className="hub-info-bar">
          <div className="hub-item">
            <FaMapMarkerAlt className="hub-icon blue" />
            <span><strong>HUB:</strong> Prishtina (PRN)</span>
          </div>
          <div className="hub-item">
            <FaClock className="hub-icon" />
            <span>
              {currentTime.toLocaleTimeString('en-GB', { 
                timeZone: 'Europe/Belgrade', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
          </div>
          <div className="hub-item">
            <FaCloudSun className="hub-icon" />
            <span>Prishtina: {weather}°C</span> 
          </div>
        </div>
      </div>

      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="kosovo">🇽🇰 Kosovo Region</option>
          <option value="europe">🇪🇺 Europe</option>
          <option value="global">🌍 Global</option>
        </select>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search callsign…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <LiveMap region={region} search={search} />
    </main>
  );
}