import { useState } from "react";
import LiveMap from "../components/map/LiveMap";
import "./Live.css";

export default function Live() {
  const [region, setRegion] = useState("global");
  const [search, setSearch] = useState("");

  return (
    <main className="live-page">
      <h1 className="live-title">Live Global Flights</h1>
      <p className="live-sub">Real-time world aviation updates.</p>

      <div className="filters">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="global">🌍 Global</option>
          <option value="europe">🇪🇺 Europe</option>
          <option value="kosovo">🇽🇰 Kosovo Region</option>
        </select>

        <input
          type="text"
          placeholder="Search callsign…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <LiveMap region={region} search={search} />
    </main>
  );
}
