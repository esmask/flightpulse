import React, { useState } from "react";
import { FaCheckCircle, FaChair, FaWineGlass, FaWifi, FaCrown } from "react-icons/fa";
import "./CabinClassSection.css"; 

const CABINS = {
  economy: {
    label: "Economy",
    title: "Economy Class",
    price: "From 79€",
    desc: "Fly comfortably with our modern fleet. Enjoy ergonomic seats, smart storage, and complimentary snacks.",
    features: ["Standard Legroom", "1 Cabin Bag (8kg)", "Soft Drinks Included", "USB Charging"],
    color: "#0e76fd",
    icon: <FaChair />
  },
  business: {
    label: "Business",
    title: "Business Class",
    price: "From 249€",
    desc: "Priority service from check-in to landing. Extra space, fine dining, and exclusive lounge access.",
    features: ["Priority Boarding", "2 Checked Bags (32kg)", "Lounge Access", "Gourmet Meals"],
    color: "#a855f7",
    icon: <FaWineGlass />
  },
  first: {
    label: "First Class",
    title: "First Class",
    price: "From 499€",
    desc: "Private suites and dedicated concierge. The absolute pinnacle of luxury travel.",
    features: ["Private Suite", "Chauffeur Service", "À la carte Dining", "Unlimited Wi-Fi"],
    color: "#eab308",
    icon: <FaCrown />
  }
};

export default function CabinClassSection() {
  const [active, setActive] = useState("economy");
  const data = CABINS[active];

  return (
    <section className="cabin-section">
      <div className="section-header">
        <p className="section-tag">EXPERIENCE</p>
        <h2>Choose Your Comfort</h2>
      </div>

      <div className="cabin-container">
        
        {/* LEVA STRANA: MENU ZA BIRANJE */}
        <div className="cabin-sidebar">
          {Object.keys(CABINS).map((key) => (
            <button 
              key={key} 
              className={`cabin-btn ${active === key ? "active" : ""}`}
              onClick={() => setActive(key)}
            >
              {/* Prikazujemo ikonicu i tekst na dugmetu */}
              <span className="btn-icon">{CABINS[key].icon}</span>
              <span className="btn-text">{CABINS[key].label}</span>
            </button>
          ))}
        </div>

        {/* DESNA STRANA: VELIKA KARTICA */}
        <div className="cabin-display" data-aos="fade-left">
          
          <div className="cabin-content">
            <span className="cabin-price-tag" style={{backgroundColor: data.color}}>
              {data.price}
            </span>
            <h3>{data.title}</h3>
            <p>{data.desc}</p>
            
            <div className="cabin-features-grid">
              {data.features.map((feat, i) => (
                <div key={i} className="feat-item">
                  <FaCheckCircle style={{color: data.color}} /> {feat}
                </div>
              ))}
            </div>
          </div>

          <div className="cabin-image-area">
            {/* Velika ikona u pozadini */}
            <div className="bg-icon" style={{color: data.color}}>
                {data.icon}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}