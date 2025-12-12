import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaPlane, FaGlobeAmericas, FaBolt, FaShieldAlt, FaUsers, FaMapMarkedAlt } from "react-icons/fa";
import airplane1 from "../assets/airplane1.json"; 
import "./About.css";

// NOVA SLIKA (Aerodrom/Putnici - Siguran link)
const STORY_IMG = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1000&auto=format&fit=crop";

export default function About() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">

      {/* --- HERO SECTION --- */}
      <div className="about-hero">
        
        {/* 1. LOTTIE (Pozadina) */}
        <div className="hero-bg-layer">
          <Player 
            autoplay 
            loop 
            src={airplane1} 
            style={{ height: '100%', width: '100%' }}
            keepLastFrame
          />
        </div>

        {/* 2. VINJETA (Crni okvir) */}
        <div className="hero-vignette"></div>

        {/* 3. SADRŽAJ */}
        <div className="about-hero-content">
          <h1 data-aos="fade-up">We Are FlightPulse</h1>
          <p data-aos="fade-up" data-aos-delay="100">
            Connecting Prishtina to the skies and the world to you.
          </p>
          
          <div className="about-stats" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-item">
              <FaPlane className="stat-icon" />
              <h3>200+</h3>
              <span>Daily Flights</span>
            </div>
            <div className="stat-item">
              <FaGlobeAmericas className="stat-icon" />
              <h3>100+</h3>
              <span>Countries</span>
            </div>
            <div className="stat-item">
              <FaBolt className="stat-icon" />
              <h3>Live</h3>
              <span>Real-Time Radar</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STORY SECTION --- */}
      <section className="about-story">
        <div className="story-container">
          <div className="story-text" data-aos="fade-right">
            <h4 className="section-badge">OUR MISSION</h4>
            <h2>Built for modern travelers</h2>
            <p>
              FlightPulse began with a simple idea: to make aviation data accessible, 
              beautiful, and easy to understand for everyone — from casual travelers to aviation enthusiasts.
            </p>
            <p>
              Based in <strong>Prishtina</strong>, we combine local expertise with global data 
              to provide the most accurate real-time tracking, airport insights, and 
              travel support available today.
            </p>
          </div>
          <div className="story-image" data-aos="fade-left">
            <img src={STORY_IMG} alt="Travelers" />
            <div className="story-glow"></div>
          </div>
        </div>
      </section>

      {/* --- VALUES SECTION --- */}
      <section className="about-values">
        <h2 className="values-title" data-aos="fade-up">Why Choose Us?</h2>
        <div className="values-grid">
          <div className="value-card" data-aos="zoom-in">
            <div className="val-icon"><FaShieldAlt /></div>
            <h3>Trust & Accuracy</h3>
            <p>We rely on top-tier data sources to ensure every flight status is precise.</p>
          </div>
          <div className="value-card" data-aos="zoom-in" data-aos-delay="100">
            <div className="val-icon"><FaBolt /></div>
            <h3>Real-Time Speed</h3>
            <p>Live updates mean you never miss a departure or arrival.</p>
          </div>
          <div className="value-card" data-aos="zoom-in" data-aos-delay="200">
            <div className="val-icon"><FaUsers /></div>
            <h3>Passenger First</h3>
            <p>Designed for clarity. No clutter, just the info you need.</p>
          </div>
          <div className="value-card" data-aos="zoom-in" data-aos-delay="300">
            <div className="val-icon"><FaMapMarkedAlt /></div>
            <h3>Global Coverage</h3>
            <p>From local PRN flights to international long-hauls, we track it all.</p>
          </div>
        </div>
      </section>

    </div>
  );
}