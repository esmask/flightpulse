import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-container">
      <div className="nav-logo">
        <Link to="/">✈️ FLIGHTPULSE</Link>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/home" onClick={() => setMenuOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/search" onClick={() => setMenuOpen(false)}>
          Search
        </NavLink>

        <NavLink to="/airports" onClick={() => setMenuOpen(false)}>
          Airports
        </NavLink>

        <NavLink to="/live" onClick={() => setMenuOpen(false)}>
          Live
        </NavLink>

        
        <NavLink to="/support" onClick={() => setMenuOpen(false)}>
          Support
        </NavLink>

        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
          About
        </NavLink>
      </nav>

      {/* Mobile menu button */}
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}
