import React from "react";
import "./Home.css";

// sekcije
import HeroSection from "../components/home/HeroSection";
import CabinClassSection from "../components/home/CabinClassSection";
import TravelSupportSection from "../components/home/TravelSupportSection";
import TopDestinations from "../components/home/TopDestinations";
import NewsletterSection from "../components/home/NewsletterSection";

export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <TopDestinations />
      <CabinClassSection />
      <TravelSupportSection />
      <NewsletterSection />
    </main>
  );
}
