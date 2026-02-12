import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlane, FaSearchMinus, FaLightbulb, FaGlobe, FaArrowRight } from "react-icons/fa";
import "./Search.css";
import searchHero from "../assets/search_hero.jpg";

const airlineMap = {
  WZZ: "Wizz Air", THY: "Turkish Airlines", AUA: "Austrian", SWR: "Swiss", DLH: "Lufthansa", EWG: "Eurowings"
};

const ROUTE_INFO_DATA = {
  "Zurich": { airline: "Swiss, Edelweiss", duration: "2h 05m", info: "Daily direct flights from Prishtina.", link: "https://www.swiss.com" },
  "Istanbul": { airline: "Turkish Airlines, Pegasus", duration: "1h 45m", info: "Up to 4 flights per day from PRN.", link: "https://www.turkishairlines.com" },
  "London": { airline: "Wizz Air", duration: "3h 10m", info: "Direct flights to London Luton (LTN).", link: "https://wizzair.com" },
  "Munich": { airline: "Lufthansa, Eurowings", duration: "1h 50m", info: "Connecting Prishtina to Bavaria daily.", link: "https://www.lufthansa.com" }
};

const AVIATION_FACTS = [
  "The shortest commercial flight in the world lasts only 57 seconds.",
  "At any moment, there are over 10,000 aircraft in the sky.",
  "Prishtina Airport handled over 3 million passengers last year!",
  "A Boeing 747 is made up of six million parts."
];

export default function Search() {
  const [allFlights, setAllFlights] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [query, setQuery] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fact, setFact] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Pomocne funkcije za UI
  const detectAirline = (callsign) => airlineMap[callsign?.slice(0, 3).toUpperCase()] || "Global Airline";
  const getAirlineLogo = (callsign) => `https://images.kiwi.com/airlines/64/${callsign?.slice(0, 2).toUpperCase()}.png`;

  useEffect(() => {
    setFact(AVIATION_FACTS[Math.floor(Math.random() * AVIATION_FACTS.length)]);
    
    async function load() {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/live-flights");
        const flights = res.data.states || [];
        setAllFlights(flights);

        const params = new URLSearchParams(location.search);
        const cityParam = params.get("query");
        
        if (cityParam) {
          setQuery(cityParam);
          setRouteInfo(ROUTE_INFO_DATA[cityParam] || null);
          const filtered = flights.filter(f => 
            f.destination?.toLowerCase().includes(cityParam.toLowerCase()) || 
            f.country?.toLowerCase().includes(cityParam.toLowerCase())
          );
          setDisplayed(filtered);
        } else {
          setDisplayed(flights.slice(0, 40));
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    load();
  }, [location.search]);

  function handleSearch() {
    setRouteInfo(ROUTE_INFO_DATA[query] || null);
    const q = query.toLowerCase();
    const found = allFlights.filter(f => 
      f.callsign?.toLowerCase().includes(q) || 
      f.destination?.toLowerCase().includes(q) ||
      f.country?.toLowerCase().includes(q)
    );
    setDisplayed(found);
  }

  return (
    <div className="search-page">
      <section className="search-hero">
        <div className="search-hero-bg" style={{ backgroundImage: `url(${searchHero})` }}></div>
        <div className="search-hero-overlay"></div>
        <div className="search-hero-content">
          <h1>Flight Explorer</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search city, country or airline..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>

      {/* ROUTE INFO PANEL */}
      {routeInfo && (
        <div className="route-info-panel fade-in">
          <div className="ri-content">
            <div className="ri-main">
              <span className="ri-badge">PRN DIRECT ROUTE</span>
              <h2>Prishtina ✈ {query}</h2>
              <p>{routeInfo.info}</p>
              <div className="ri-stats">
                <span>⏱ Duration: <strong>{routeInfo.duration}</strong></span>
                <span style={{margin: "0 15px"}}>|</span>
                <span>Airlines: <strong>{routeInfo.airline}</strong></span>
              </div>
            </div>
            <div className="ri-side">
              <a href={routeInfo.link} target="_blank" rel="noreferrer" className="book-btn">Book Tickets ↗</a>
            </div>
          </div>
        </div>
      )}

      <div className="results-container">
        {loading ? (
          <div className="loading-msg"><div className="loader-spinner"></div><p>Scanning global airspace...</p></div>
        ) : displayed.length > 0 ? (
          <div className="results-grid">
            {displayed.map((f, i) => (
              <div className="flight-card" key={i}>
                <div className="fc-header">
                  <div className="fc-logo-wrap">
                    <img src={getAirlineLogo(f.callsign)} alt="" className="fc-logo" />
                    <div>
                      <h3>{f.callsign}</h3>
                      <span className="fc-airline">{detectAirline(f.callsign)}</span>
                    </div>
                  </div>
                  <div className="live-dot"></div>
                </div>

                {/* PRIKAZ RUTE NA KARTICI - POPRAVLJENO */}
                <div className="fc-route-path">
                  <span>{f.origin || "PRN"}</span>
                  <div className="route-line-ui">
                    <span className="plane-mini-icon">✈</span>
                  </div>
                  <span>{f.destination || "Any"}</span>
                </div>

                <div className="fc-body">
                  <div className="fc-row"><span className="fc-label">Country</span><span className="fc-val">{f.country}</span></div>
                  <div className="fc-row"><span className="fc-label">Speed</span><span className="fc-val">{f.speed} km/h</span></div>
                </div>
                <button className="fc-btn" onClick={() => navigate(`/flight/${f.callsign}`)}>Track Live</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-container fade-in">
            <FaSearchMinus size={50} color="#374151" />
            <h2>No live flights found</h2>
            <div className="fact-box">
              <FaLightbulb color="#0e76fd" /> <strong>Did you know?</strong>
              <p>{fact}</p>
            </div>
            <button className="reset-btn" onClick={() => { setQuery(""); navigate("/search"); }}>Show All Flights</button>
          </div>
        )}
      </div>
    </div>
  );
}