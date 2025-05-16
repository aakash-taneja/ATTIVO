import React, { useState } from "react";
import { useRouter } from "next/router";
// CSS is imported globally in _app.tsx
import Link from "next/link";

const LandingPage: React.FC = () => {
  const router = useRouter();

  const handleEnterApp = () => {
    router.push("/app");
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="logo-container">
          <img
            src="/assets/attivo-logo.png"
            alt="ATTIVO Logo"
            className="landing-logo"
          />
        </div>

        <button className="connect-button" onClick={handleEnterApp}>
          CONNECT WALLET
        </button>

        <p className="landing-slogan">
          ENERGIZE YOUR GAME, REWARD YOUR STATS, ELEVATE YOUR LIFE!
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
