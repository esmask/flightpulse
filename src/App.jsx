// src/App.jsx
import { useEffect } from "react"; // Dodato
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"; // Dodato useLocation

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Live from "./pages/Live";
import FlightDetails from "./pages/FlightDetails";
import About from "./pages/About";
import Airports from "./pages/Airports";
import Footer from "./components/Footer/Footer";
import Support from "./pages/Support";

// --- POMOĆNA KOMPONENTA ZA SKROL NA VRH ---
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Svaki put kad se promeni stranica (pathname), vrati skrol na vrh
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      {/* 1. Ovo mora biti ovde, unutar Router-a, da bi radilo */}
      <ScrollToTop />

      <Navbar />

      <div className="page-wrapper">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* SEARCH */}
          <Route path="/search" element={<Search />} />

          {/* LIVE FLIGHTS LIST */}
          <Route path="/live" element={<Live />} />

          {/* FLIGHT DETAILS */}
          <Route path="/flight/:id" element={<FlightDetails />} />

          {/* ABOUT */}
          <Route path="/about" element={<About />} />

          {/* AIRPORTS */}
          <Route path="/airports" element={<Airports />} />

          {/* SUPPORT CENTER */}
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}