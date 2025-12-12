import { useEffect, useState } from "react";
import axios from "axios";
import "./Search.css";
import searchHero from "../assets/search_hero.jpg";
import { useNavigate } from "react-router-dom";

// 1. MAPA ZA IMENA AVIOKOMPANIJA (Samo kao pomoć za lepši ispis)
const airlineMap = {
  WZZ: "Wizz Air", W6: "Wizz Air",
  RYR: "Ryanair", FR: "Ryanair",
  EZY: "EasyJet", U2: "EasyJet",
  AUA: "Austrian", OS: "Austrian",
  THY: "Turkish Airlines", TK: "Turkish Airlines",
  DLH: "Lufthansa", LH: "Lufthansa",
  SWR: "Swiss", LX: "Swiss",
  BAW: "British Airways", BA: "British Airways",
  AFR: "Air France", AF: "Air France",
  JAT: "Air Serbia", JU: "Air Serbia",
  QTR: "Qatar Airways", QR: "Qatar Airways",
  UAE: "Emirates", EK: "Emirates",
  DAL: "Delta", DL: "Delta",
  UAL: "United", UA: "United"
};

// 2. MAPA ZA KODOVE DRŽAVA (Za zastave)
const countryToCode = {
  "United States": "US", "USA": "US",
  "United Kingdom": "GB", "Great Britain": "GB",
  "Germany": "DE", "France": "FR", "Italy": "IT", "Spain": "ES",
  "Turkey": "TR", "Switzerland": "CH", "Austria": "AT", "Poland": "PL",
  "Netherlands": "NL", "Belgium": "BE", "Greece": "GR", "Hungary": "HU",
  "Kosovo": "XK", "Republic of Kosovo": "XK", "Albania": "AL",
  "Serbia": "RS", "Croatia": "HR", "China": "CN", "Japan": "JP",
  "Canada": "CA", "Australia": "AU", "Brazil": "BR", "Qatar": "QA",
  "United Arab Emirates": "AE", "Portugal": "PT", "Ireland": "IE",
  "Sweden": "SE", "Norway": "NO", "Russia": "RU", "India": "IN"
};

// --- HELPERS ---

function detectAirline(callsign) {
  if (!callsign) return "Unknown Airline";
  const prefix = callsign.slice(0, 3).toUpperCase();
  return airlineMap[prefix] || prefix + " Airlines";
}

function getAirlineLogo(callsign) {
  if (!callsign) return null;
  const prefix = callsign.slice(0, 2).toUpperCase();
  return `https://images.kiwi.com/airlines/64/${prefix}.png`;
}

function getFlag(countryName) {
  if (!countryName) return null;
  const cleanName = countryName.trim();
  
  // KOSOVO FIX
  if (cleanName === "Kosovo" || cleanName === "Republic of Kosovo" || cleanName === "XK" || cleanName === "KS") {
    return "https://flagcdn.com/w80/xk.png";
  }

  // Traži kod u mapi
  let code = countryToCode[cleanName];
  
  // Ako nema u mapi, probaj prva 2 slova (fallback)
  if (!code && cleanName.length === 2) code = cleanName;

  if (code) return `https://flagsapi.com/${code.toUpperCase()}/flat/64.png`;
  return null;
}

export default function Search() {
  const [allFlights, setAllFlights] = useState([]); // Svi učitani letovi
  const [displayed, setDisplayed] = useState([]);   // Oni koji se vide na ekranu
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Dinamičke liste za filtere (popunjavaju se same)
  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableAirlines, setAvailableAirlines] = useState([]);

  // Izabrani filteri
  const [airlineFilter, setAirlineFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [speedSort, setSpeedSort] = useState("");

  const navigate = useNavigate();

  // === 1. UČITAVANJE LETOVA ===
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await axios.get("http://localhost:5000/live-flights");
        const rawData = res.data.states || [];

        // Filtriramo samo validne (moraju imati koordinate i ime)
        const validFlights = rawData.filter(f => f.callsign && f.lat && f.lon);

        if (validFlights.length === 0) {
          setErrorMsg("Backend is running but no flights found right now.");
        }

        setAllFlights(validFlights);
        setDisplayed(validFlights.slice(0, 60)); // Prikaži prvih 60 odmah

        // --- DINAMIČKO PUNJENJE FILTERA ---
        // Izvlačimo sve jedinstvene države koje se trenutno vide
        const countries = [...new Set(validFlights.map(f => f.country).filter(Boolean))].sort();
        setAvailableCountries(countries);

        // Izvlačimo sve jedinstvene aviokompanije
        const airlines = [...new Set(validFlights.map(f => detectAirline(f.callsign)))].sort();
        setAvailableAirlines(airlines);

      } catch (err) {
        console.error(err);
        setErrorMsg("Could not load flights. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // === 2. PRETRAGA (Search Bar) ===
  function handleSearch() {
    // Ako je prazno, samo primeni filtere na sve
    if (!query.trim()) {
      applyFilters(allFlights);
      return;
    }

    const q = query.toLowerCase();
    
    // Filtriraj po unetom tekstu
    const found = allFlights.filter((f) => {
      const callsignMatch = f.callsign?.toLowerCase().includes(q);
      const countryMatch = f.country?.toLowerCase().includes(q);
      const airlineMatch = detectAirline(f.callsign).toLowerCase().includes(q);
      
      return callsignMatch || countryMatch || airlineMatch;
    });

    if (found.length === 0) setErrorMsg("No flights match your search.");
    else setErrorMsg("");

    // Primeni i sortiranje na rezultate pretrage
    applyFilters(found); 
  }

  // === 3. FILTER LOGIKA ===
  function applyFilters(sourceData = allFlights) {
    let result = [...sourceData];

    // Filter Airline
    if (airlineFilter) {
      result = result.filter(f => detectAirline(f.callsign) === airlineFilter);
    }

    // Filter Country
    if (countryFilter) {
      result = result.filter(f => f.country === countryFilter);
    }

    // Sort Speed
    if (speedSort === "asc") {
      result.sort((a, b) => (a.speed || 0) - (b.speed || 0));
    } else if (speedSort === "desc") {
      result.sort((a, b) => (b.speed || 0) - (a.speed || 0));
    }

    setDisplayed(result.slice(0, 60)); // Limit da ne koči browser
  }

  // Prati promene u dropdown menijima
  useEffect(() => {
    applyFilters(allFlights);
  }, [airlineFilter, countryFilter, speedSort]);

  return (
    <div className="search-page">

      {/* HERO SECTION */}
      <section className="search-hero">
        <div className="search-hero-bg" style={{ backgroundImage: `url(${searchHero})` }}></div>
        <div className="search-hero-overlay"></div>
        <div className="search-hero-content">
          <h1 className="search-title">Search Flights</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Flight ID, Country or Airline..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </section>

      {/* --- DINAMIČKI FILTERI --- */}
      <div className="filters">
        
        {/* Dropdown za Aviokompanije (Puni se sam) */}
        <select onChange={(e) => setAirlineFilter(e.target.value)}>
          <option value="">✈️ All Airlines ({availableAirlines.length})</option>
          {availableAirlines.map((airline, index) => (
            <option key={index} value={airline}>{airline}</option>
          ))}
        </select>

        {/* Dropdown za Države (Puni se sam) */}
        <select onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="">🌍 All Countries ({availableCountries.length})</option>
          {availableCountries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>

        {/* Sortiranje */}
        <select onChange={(e) => setSpeedSort(e.target.value)}>
          <option value="">⚡ Sort by Speed</option>
          <option value="asc">Slower First</option>
          <option value="desc">Faster First</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading-msg">
          <div className="loader-spinner"></div>
          <p>Scanning global airspace...</p>
        </div>
      )}

      {/* ERROR / EMPTY STATE */}
      {!loading && displayed.length === 0 && (
        <div className="empty-state">
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486809.png" alt="No results" width="80" />
          <p>{errorMsg || "No flights found matching criteria."}</p>
        </div>
      )}

      {/* --- REZULTATI (KARTICE) --- */}
      <div className="results-grid">
        {displayed.map((f, i) => {
          const airlineName = detectAirline(f.callsign);
          const flagUrl = getFlag(f.country);
          const logoUrl = getAirlineLogo(f.callsign); 

          return (
            <div className="flight-card" key={i}>
              
              {/* HEADER KARTICE */}
              <div className="fc-header">
                <div className="fc-logo-wrap">
                  {/* Logo Aviokompanije */}
                  <img 
                    src={logoUrl} 
                    alt="logo" 
                    className="fc-logo"
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                  <div>
                    <h3>{f.callsign}</h3>
                    <span className="fc-airline">{airlineName}</span>
                  </div>
                </div>
                <div className="live-dot"></div> {/* Zelena tačkica */}
              </div>

              {/* PODACI */}
              <div className="fc-body">
                <div className="fc-row">
                  <span className="fc-label">Country</span>
                  <div className="fc-val">
                    {flagUrl && <img src={flagUrl} alt="flag" className="fc-flag" />}
                    {f.country || "Intl. Airspace"}
                  </div>
                </div>

                <div className="fc-row">
                  <span className="fc-label">Speed</span>
                  <span className="fc-val">{Math.round((f.speed || 0) * 3.6)} km/h</span>
                </div>

                <div className="fc-row">
                  <span className="fc-label">Altitude</span>
                  <span className="fc-val">{Math.round(f.alt || 0)} m</span>
                </div>
              </div>

              <button className="fc-btn" onClick={() => navigate(`/flight/${f.callsign}`)}>
                Track Live ✈
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}