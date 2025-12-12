import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Player } from "@lottiefiles/react-lottie-player";
import planeAnim from "../../assets/airplane.json";
import "./NewsletterSection.css";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    setLoading(true);

    const serviceID = "service_4mx7i43";      // ✔ PRAVI SERVICE ID
    const templateID = "template_c64ggjx";    // ✔ TEMPLATE ID
    const publicKey = "zfGOwg5uumkzYOGK3";    // ✔ JAVNI KLJUČ

    const templateParams = {
      subscriber_email: email,
      newsletter_content: "Thank you for subscribing to FlightPulse!",
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        setLoading(false);
        alert("🎉 You are now subscribed!");
        setEmail("");
      })
      .catch((error) => {
        console.log("EmailJS error:", error);
        setLoading(false);
        alert("Something went wrong. Try again.");
      });
  };

  return (
    <section className="newsletter-section">

      <div className="newsletter-left">
        <Player
          autoplay
          loop
          src={planeAnim}
          className="newsletter-animation"
        />
      </div>

      <div className="newsletter-card">
        <p className="section-tag">STAY UPDATED</p>
        <h2 className="newsletter-title">Subscribe & get the latest news</h2>
        <p className="section-sub">
          Get flight deals, route updates, and aviation news directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-row">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Subscribe"}
          </button>
        </form>

        <p className="newsletter-note">No spam. Unsubscribe anytime.</p>
      </div>

    </section>
  );
}
