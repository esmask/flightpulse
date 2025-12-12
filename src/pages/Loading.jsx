import { Player } from "@lottiefiles/react-lottie-player";
import planeAnimation from "../assets/plane.json";
import bg from "../assets/bg.jpg";

export default function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      {/* CLOUD BACKGROUND */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: "cloudMove 45s linear infinite",
          opacity: 0.50,
        }}
      />

      {/* DARK VIGNETTE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.1), rgba(0,0,0,0.85))",
        }}
      />

      {/* NEON HALO BEHIND MAIN ICON */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(0,190,255,0.35)",
          filter: "blur(80px)",
          animation: "haloPulse 5s ease-in-out infinite",
        }}
      />

      {/* MAIN ANIMATION */}
      <Player
        autoplay
        keepLastFrame
        src={planeAnimation}
        style={{
          height: 230,
          width: 230,
          marginBottom: "1rem",
          filter: "drop-shadow(0 0 22px #08c6f9)",
          position: "relative",
          zIndex: 5,
        }}
      />

      {/* TITLE */}
      <h2
        style={{
          position: "relative",
          zIndex: 5,
          color: "#e9f7ff",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textShadow: "0 0 20px rgba(8,198,249,0.8)",
          marginBottom: "0.8rem",
        }}
      >
        FLIGHTPULSE
      </h2>

      {/* SUBTEXT */}
      <p
        style={{
          position: "relative",
          zIndex: 5,
          color: "#cbd9ff",
          fontSize: "1rem",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        Synchronizing sky routes, radar telemetry and live air traffic nodes...
      </p>

      {/* SYSTEM STATUS */}
      <p
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "0.6rem",
          color: "#7c8ca8",
          fontSize: "0.82rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Avionics secure • Data link stable • Systems nominal
      </p>

      {/* PROGRESS BAR (4s) */}
      <div style={{ position: "relative", zIndex: 5, width: "320px", marginTop: "1.2rem" }}>
        <div
          style={{
            width: "100%",
            height: 5,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background:
                "linear-gradient(90deg, #0e76fd, #08c6f9, #22c55e)",
              animation: "loadingBar 4s linear forwards",
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes cloudMove {
            0% { transform: scale(1) translateX(0); }
            100% { transform: scale(1.1) translateX(-20%); }
          }

          @keyframes haloPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.12); }
          }

          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
          }
        `}
      </style>
    </div>
  );
}
