import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import "./Support.css";

// ICONS
import { 
  FaTicketAlt, FaPassport, FaPlaneDeparture, FaSuitcaseRolling, 
  FaChild, FaHeadset, FaSearch, FaTimes, FaPaperPlane, FaRobot, FaCommentDots 
} from "react-icons/fa";

const Player = lazy(() =>
  import("@lottiefiles/react-lottie-player").then((m) => ({
    default: m.Player,
  }))
);

import planeAnim from "../assets/airplane.json";

// ⚠️ TVOJ API KLJUČ (Zameni 'TVOJ_NOVI_KLJUC' sa onim koji si poslala ako ga nisi obrisala, ali pazi!)
const OPENAI_API_KEY = "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";

export default function Support() {
  const navigate = useNavigate();

  // STATE ZA EMAIL FORMU
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // STATE ZA LIVE CHAT
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Da piše "Bot is typing..."
  
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! 👋 I am FlightPulse AI. Ask me anything about flights, baggage, or airports!" }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- 1. FUNKCIJA ZA LIVE CHAT BOT (OPENAI) ---
  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // 1. Prikazi tvoju poruku odmah
    const userMsg = { sender: "user", text: chatInput };
    const currentInput = chatInput; // Cuvamo tekst za slanje
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true); // Pokaži da bot "razmišlja"

    try {
      // 2. Pošalji zahtev OpenAI-ju
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Ili "gpt-4o-mini" ako ti je jeftinije
          messages: [
            { role: "system", content: "You are FlightPulse AI, a helpful assistant for an aviation app. Keep answers short, friendly and related to travel." },
            ...messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })), // Istorija chata
            { role: "user", content: currentInput }
          ]
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const botReply = data.choices[0].message.content;
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      } else {
        throw new Error("No response");
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I'm having trouble connecting to the server right now. 🔌" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- 2. OSTALE FUNKCIJE ---
  const openAirportGuide = () => {
    navigate("/airports");
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email || !message || !name) return alert("Please fill in all fields.");

    setLoading(true);

    const serviceID = "service_4mx7i43";
    const templateID = "template_yos2qal"; // Tvoj novi template ID
    const publicKey = "zfGOwg5uumkzYOGK3";

    const templateParams = { name, email, message };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        alert("✅ Message sent! Check your email.");
        setModalOpen(false);
        setName(""); setEmail(""); setMessage("");
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Failed to send. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const openModalWithTopic = (topic) => {
    setMessage(`Topic: ${topic}\n\nMy question is: `);
    setModalOpen(true);
  };

  return (
    <main className="support-page">

      {/* --- LIVE CHAT PROZOR --- */}
      {chatOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div className="chat-title">
              <FaRobot /> FlightPulse AI
            </div>
            <button onClick={() => setChatOpen(false)} className="chat-close"><FaTimes /></button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && <div className="chat-message bot">Thinking... 🤔</div>}
          </div>

          <form className="chat-footer" onSubmit={handleChatSend}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
        </div>
      )}

      {/* --- EMAIL MODAL --- */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setModalOpen(false)}><FaTimes /></button>
            <h2>Contact Support</h2>
            <p>Fill out the form below and we will reply to your email.</p>
            <form onSubmit={handleSendEmail}>
              <label>Your Name:</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              
              <label>Your Email:</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <label>Message / Issue:</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Describe your issue..." />

              <button type="submit" disabled={loading} className="modal-send-btn">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="sup-hero">
        <div className="sup-hero-content">
          <div className="sup-text">
            <h4 className="sup-badge">24/7 HELP CENTER</h4>
            <h1>How can we help you?</h1>
            <p>From Prishtina to the world — get real support from our team.</p>
            
            <div className="sup-search">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Type your question..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if(e.key === "Enter" && message.trim()) setModalOpen(true); }}
              />
            </div>
          </div>
          <div className="sup-anim-wrapper">
            <Suspense fallback={<div className="plane-placeholder"></div>}>
              <Player autoplay loop src={planeAnim} className="plane-animation" />
            </Suspense>
          </div>
        </div>
      </div>

      {/* GRID KARTICE */}
      <div className="sup-container">
        <h2 className="sup-section-title">Browse Topics</h2>
        
        <div className="sup-grid">
          <div className="sup-card" onClick={() => openModalWithTopic("Booking & Tickets")}>
            <div className="icon-box"><FaTicketAlt /></div>
            <h3>Booking & Tickets</h3>
            <p>Manage reservations, change dates, or request refunds.</p>
            <span className="sup-link">Open Ticket →</span>
          </div>

          <div className="sup-card" onClick={() => openModalWithTopic("Visa & Passport")}>
            <div className="icon-box"><FaPassport /></div>
            <h3>Travel Docs</h3>
            <p>Visa requirements, passport validity rules, and forms.</p>
            <span className="sup-link">Check Rules →</span>
          </div>

          <div className="sup-card" onClick={openAirportGuide}>
            <div className="icon-box"><FaPlaneDeparture /></div>
            <h3>Airport Guide</h3>
            <p>Check-in counters, gate locations, and terminal maps.</p>
            <span className="sup-link">View Maps →</span>
          </div>

          <div className="sup-card" onClick={() => openModalWithTopic("Lost Baggage")}>
            <div className="icon-box"><FaSuitcaseRolling /></div>
            <h3>Baggage</h3>
            <p>Lost luggage tracking, weight allowances, and prohibited items.</p>
            <span className="sup-link">Report Issue →</span>
          </div>

          <div className="sup-card" onClick={() => openModalWithTopic("Special Assistance")}>
            <div className="icon-box"><FaChild /></div>
            <h3>Special Care</h3>
            <p>Assistance for unaccompanied minors or reduced mobility.</p>
            <span className="sup-link">Request Help →</span>
          </div>

          {/* --- LIVE CHAT CARD (Sada koristi AI) --- */}
          <div className="sup-card contact-card">
            <div className="icon-box special"><FaHeadset /></div>
            <h3>AI Support</h3>
            <div className="contact-details">
              <p>🤖 <strong>Instant Answers</strong></p>
              <p>📍 <strong>Available 24/7</strong></p>
            </div>
            <button className="chat-btn" onClick={() => setChatOpen(!chatOpen)}>
              <FaCommentDots style={{marginRight: "8px"}}/> Chat with AI
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}