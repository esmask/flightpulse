import React from "react";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TopDestinations.css";

const DESTINATIONS = [
  { city: "Zurich", country: "Switzerland", price: "€129", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=600&auto=format&fit=crop" },
  { city: "Istanbul", country: "Turkey", price: "€89", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=600&auto=format&fit=crop" },
  { city: "London", country: "UK", price: "€149", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop" },
  { city: "Munich", country: "Germany", price: "€119", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/800px-Stadtbild_M%C3%BCnchen.jpg" },
];

export default function TopTravelersSection() {
  const navigate = useNavigate();

  return (
    <section className="destinations-section">
      <div className="section-header">
        <p className="section-tag">DISCOVER</p>
        <h2>Trending from Prishtina</h2>
        <p className="section-sub">Most popular routes this month. Book your next adventure directly from PRN.</p>
      </div>

      <div className="destinations-grid">
        {DESTINATIONS.map((dest, i) => (
          <div key={i} className="dest-card" onClick={() => navigate(`/search?query=${dest.city}`)} style={{ cursor: "pointer" }}>
            <div className="dest-img-box">
              <img src={dest.img} alt={dest.city} />
              <div className="dest-price">from {dest.price}</div>
            </div>
            <div className="dest-info">
              <div>
                <h3>{dest.city}</h3>
                <span className="dest-country"><FaMapMarkerAlt /> {dest.country}</span>
              </div>
              <button className="dest-btn"><FaArrowRight /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}