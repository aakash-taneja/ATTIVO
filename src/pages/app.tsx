import React, { useState } from "react";
import SportID from "../components/SportID";
import SocialFeed from "../components/SocialFeed";
import DailyChallenge from "../components/DailyChallenge";
import Marketplace from "../components/Marketplace";

export default function App() {
  const [activeTab, setActiveTab] = useState("sportId");

  // Navigation tabs
  const tabs = [
    { id: "sportId", label: "SPORT ID", icon: "👤" },
    { id: "feed", label: "SOCIAL FEED", icon: "📱" },
    { id: "challenges", label: "CHALLENGES", icon: "🏆" },
    { id: "marketplace", label: "MARKETPLACE", icon: "🛒" },
  ];

  // Render active component based on tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "sportId":
        return <SportID />;
      case "feed":
        return <SocialFeed />;
      case "challenges":
        return <DailyChallenge />;
      case "marketplace":
        return <Marketplace />;
      default:
        return <SportID />;
    }
  };

  return (
    <div style={{ fontFamily: "'Barlow Condensed', 'Orbitron', sans-serif" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#000000",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src="/assets/attivo-logo.png"
            alt="ATTIVO Logo"
            style={{ height: "40px", width: "auto" }}
          />
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            ATTIVO SPORTS PLATFORM
          </div>
        </div>
        <button className="button button-primary">CONNECTED</button>
      </header>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #333333",
          backgroundColor: "#000000",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
              borderBottom:
                activeTab === tab.id
                  ? "3px solid #FF0000"
                  : "3px solid transparent",
              fontWeight: activeTab === tab.id ? "bold" : "normal",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: activeTab === tab.id ? "#FF0000" : "white",
              letterSpacing: "1px",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <main
        style={{
          padding: "2rem 0",
          backgroundColor: "#111111",
          minHeight: "calc(100vh - 120px)",
          color: "white",
        }}
      >
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#000000",
          color: "white",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>ATTIVO SPORTS PLATFORM © {new Date().getFullYear()}</div>
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.875rem",
            color: "#FF6A00",
          }}
        >
          POWERED BY BLOCKCHAIN TECHNOLOGY
        </div>
      </footer>
    </div>
  );
}
