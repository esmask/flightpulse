import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaPlane, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* LEVO: LOGO I OPIS */}
        <div className="footer-brand">
          <div className="brand-logo">
            <FaPlane className="logo-icon" />
            <h2>FlightPulse</h2>
          </div>
          <p className="brand-desc">
            Your real-time aviation companion. <br />
            Proudly built in <strong>Prishtina</strong> for the world.
          </p>
          <div className="brand-badge">
            <FaMapMarkerAlt /> Prishtina Hub • Global Reach
          </div>
        </div>

        {/* SREDINA: LINKOVI */}
        <div className="footer-links">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search Flights</Link></li>
            <li><Link to="/live">Live Radar</Link></li>
            <li><Link to="/airports">Airports</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Support</h3>
          <ul>
            <li><Link to="/support">Help Center</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* DESNO: SOCIAL */}
        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FlightPulse – All rights reserved.</p>
      </div>
    </footer>
  );
}