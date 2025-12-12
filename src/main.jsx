import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/global.css";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";


import AOS from "aos";
import "aos/dist/aos.css";

// LOADING PAGE
import Loading from "./pages/Loading";

AOS.init({
  duration: 900,
  once: false,
  mirror: true,
});

function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2500); // 2.5s loader
    return () => clearTimeout(t);
  }, []);

  return loading ? <Loading /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
