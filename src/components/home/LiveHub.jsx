import React from "react";
import { useNavigate } from "react-router-dom";
import "./LiveHub.css";
import { FaPlaneDeparture, FaGlobeAmericas, FaSatelliteDish } from "react-icons/fa";

export default function LiveHub() {
  const navigate = useNavigate();

  return (
    <section className="live-hub-section">
      <div className="hub-container">
        <div className="hub-header" data-aos="fade-up">
          <p className="section-tag">FLIGHTPULSE ECOSYSTEM</p>
          <h2>Live Flight Intelligence</h2>
          <p className="hub-sub">Explore the real-time data powering our global network.</p>
        </div>

        <div className="hub-stats-grid">
          {/* KARTICA 1 */}
          <div className="hub-card" onClick={() => navigate("/search")} data-aos="fade-up" data-aos-delay="100">
            <div className="hub-card-content">
              <div className="hub-icon-box"><FaPlaneDeparture /></div>
              <div className="hub-info">
                <span className="hub-number">450+</span>
                <span className="hub-label">Daily Flights</span>
              </div>
              <div className="hub-link-hint">Search Schedule →</div>
            </div>
          </div>

          {/* KARTICA 2 */}
          <div className="hub-card" onClick={() => navigate("/airports")} data-aos="fade-up" data-aos-delay="200">
            <div className="hub-card-content">
              <div className="hub-icon-box"><FaGlobeAmericas /></div>
              <div className="hub-info">
                <span className="hub-number">82</span>
                <span className="hub-label">Connected Cities</span>
              </div>
              <div className="hub-link-hint">Airport Database →</div>
            </div>
          </div>

          {/* KARTICA 3 */}
          <div className="hub-card" onClick={() => navigate("/live")} data-aos="fade-up" data-aos-delay="300">
            <div className="hub-card-content">
              <div className="hub-icon-box"><FaSatelliteDish /></div>
              <div className="hub-info">
                <span className="hub-number">99.9%</span>
                <span className="hub-label">Radar Uptime</span>
              </div>
              <div className="hub-link-hint">Track Live Map →</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}