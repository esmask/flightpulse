import { Player } from "@lottiefiles/react-lottie-player";
import "./Loading.css";
import planeAnimation from "../assets/plane.json";
import bg from "../assets/bg.jpg";

export default function Loading() {
  return (
    <div className="loading-screen">
      {/* CLOUD BACKGROUND */}
      <div className="loading-bg" />

      {/* DARK VIGNETTE */}
      <div className="loading-vignette" />

      {/* NEON HALO */}
      <div className="loading-halo" />

      {/* MAIN ANIMATION */}
      <Player
        autoplay
        keepLastFrame
        src={planeAnimation}
        className="loading-plane"
      />

      {/* TITLE */}
      <h2 className="loading-title">FLIGHTPULSE</h2>

      {/* SUBTEXT */}
      <p className="loading-sub">
        Synchronizing sky routes, radar telemetry and live air traffic nodes...
      </p>

      {/* SYSTEM STATUS */}
      <p className="loading-status">
        Avionics secure • Data link stable • Systems nominal
      </p>

      {/* PROGRESS BAR */}
      <div className="loading-bar-wrapper">
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
