// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Live from "./pages/Live";
import FlightDetails from "./pages/FlightDetails";
import About from "./pages/About";
import Airports from "./pages/Airports";
import Footer from "./components/Footer/Footer";
import Support from "./pages/Support";

export default function App() {
  return (
    <Router>
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
