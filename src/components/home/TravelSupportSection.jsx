import React from "react";
import { FaPassport, FaSuitcaseRolling, FaPercentage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TravelSupportSection.css"; // Novi CSS fajl

export default function TravelSupportSection() {
  const navigate = useNavigate();

  return (
    <section className="ts-section">
      <div className="section-header" data-aos="fade-up">
        <p className="section-tag">TRAVEL SUPPORT</p>
        <h2>Plan with Confidence</h2>
        <p className="section-sub">
          Everything you need for a smooth journey, accessible in one click.
        </p>
      </div>

      <div className="ts-grid">
        
        {/* CARD 1 */}
        <div className="ts-card" data-aos="fade-up" onClick={() => navigate("/support")}>
          <div className="ts-icon"><FaPassport /></div>
          <h3>Smart Checklist</h3>
          <p>Visa requirements, documents, and travel rules for every country.</p>
        </div>

        {/* CARD 2 */}
        <div className="ts-card" data-aos="fade-up" data-aos-delay="100" onClick={() => navigate("/support")}>
          <div className="ts-icon"><FaSuitcaseRolling /></div>
          <h3>Baggage Guide</h3>
          <p>Check allowances, prohibited items, and report lost luggage.</p>
        </div>

        {/* CARD 3 */}
        <div className="ts-card" data-aos="fade-up" data-aos-delay="200" onClick={() => navigate("/support")}>
          <div className="ts-icon"><FaPercentage /></div>
          <h3>Deals & Offers</h3>
          <p>Find the best prices and exclusive seasonal savings.</p>
        </div>

      </div>

      <div className="ts-footer">
        <button className="ts-btn" onClick={() => navigate("/support")}>
          Open Support Center
        </button>
      </div>
    </section>
  );
}