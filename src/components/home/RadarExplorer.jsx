import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaSatellite, FaBolt } from "react-icons/fa";
import "./RadarExplorer.css";

export default function RadarExplorer() {
  const navigate = useNavigate();

  return (
    <section className="radar-explorer-section">
      <div className="explorer-container">
        
        {/* LEVA STRANA: NAPREDNI RADAR */}
        <div className="radar-visual-area" data-aos="zoom-in" onClick={() => navigate("/live")}>
          <div className="radar-monitor">
            <div className="radar-grid"></div>
            <div className="radar-sweep"></div>
            <div className="radar-ping p1"></div>
            <div className="radar-ping p2"></div>
            <div className="radar-ping p3"></div>
            
            {/* Tehnički detalji u uglovima */}
            <div className="radar-coords top-left">LAT: 42.6675° N</div>
            <div className="radar-coords top-right">LON: 21.1662° E</div>
            <div className="radar-coords bottom-left">SCAN: ACTIVE</div>
            <div className="radar-status-badge">LIVE RADAR FEED</div>
          </div>
        </div>

        {/* DESNA STRANA: INTERAKTIVNI TEKST I KARTICE */}
        <div className="explorer-content" data-aos="fade-left">
          <p className="section-tag">ADVANCED TRACKING</p>
          <h2 className="explorer-title">Explore the Skies in Real-Time</h2>
          <p className="explorer-description">
            Our high-frequency radar system tracks thousands of aircraft simultaneously. 
            Get instant access to flight paths, altitude, and technical data.
          </p>

          <div className="explorer-cards-stack">
            {/* Kartica 1 */}
            <div className="exp-card" onClick={() => navigate("/live")}>
              <div className="exp-card-icon"><FaCompass /></div>
              <div className="exp-card-text">
                <h4>Precision Tracking</h4>
                <p>Pinpoint accuracy for global and regional flights.</p>
              </div>
            </div>

            {/* Kartica 2 */}
            <div className="exp-card" onClick={() => navigate("/airports")}>
              <div className="exp-card-icon"><FaSatellite /></div>
              <div className="exp-card-text">
                <h4>Hub Intelligence</h4>
                <p>Technical data and maps for over 100+ global airports.</p>
              </div>
            </div>
          </div>

          <button className="launch-radar-btn" onClick={() => navigate("/live")}>
            Launch Live Radar <FaBolt style={{marginLeft: "10px"}} />
          </button>
        </div>

      </div>
    </section>
  );
}