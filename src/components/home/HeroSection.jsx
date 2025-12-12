import React, { useEffect } from "react";
import AOS from "aos";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaSearch, FaMapMarkedAlt } from "react-icons/fa";
import "../../styles/global.css"; // Tvoj global css
import background1 from "../../assets/background1.png";
import "./HeroSection.css"; // Napravicemo novi CSS dole

export default function HeroSection() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${background1})` }}>
      <div className="hero-overlay" />

      <div className="hero-inner" data-aos="fade-up">
        
        {/* OVO JE PROMENJENO DA IMA SMISLA */}
        <p className="hero-badge">GLOBAL AVIATION </p>

        <h1 className="hero-title">
          The Pulse of <br />
          <span className="gradient-text">Global Aviation</span>
        </h1>

        <p className="hero-subtitle">
          Real-time flight tracking, airport insights, and travel support — 
          built in Prishtina for travelers worldwide.
        </p>

        {/* STATISTIKA */}
        <div className="hero-stats-row">
          <div className="stat-pill">✈️ 10,000+ Flights</div>
          <div className="stat-pill">🌍 Real-Time Radar</div>
          <div className="stat-pill">📍 Prishtina (PRN) Focus</div>
        </div>

        {/* DUGMICI */}
        <div className="hero-actions">
          <button className="hero-btn primary" onClick={() => navigate("/search")}>
            <FaSearch /> Search Flights
          </button>
          <button className="hero-btn glass" onClick={() => navigate("/live")}>
            <FaMapMarkedAlt /> Live Map
          </button>
          <button className="hero-btn glass" onClick={() => navigate("/airports")}>
            <FaPlaneDeparture /> Airports
          </button>
        </div>

      </div>
    </div>
  );
}