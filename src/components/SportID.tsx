import React, { useState, useEffect } from "react";
import { SportProfile, ActivityRecord, TitleNFT } from "../utils/types";
import { mockSportProfile } from "../utils/mockData";
import {
  connectWallet,
  getConnectionStatus,
  claimTitle,
} from "../utils/blockchain";
// CSS is imported globally in _app.tsx

interface SportIDProps {
  initialProfile?: SportProfile;
}

const SportID: React.FC<SportIDProps> = ({
  initialProfile = mockSportProfile,
}) => {
  const [profile, setProfile] = useState<SportProfile>(initialProfile);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected
    const connectionStatus = getConnectionStatus();
    setIsConnected(connectionStatus.connected);
  }, []);

  const handleConnectWallet = async () => {
    try {
      const result = await connectWallet();
      setIsConnected(result.connected);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get icon color based on sport type
  const getSportColor = (type: string): string => {
    const colors: Record<string, string> = {
      running: "#10B981",
      basketball: "#F59E0B",
      soccer: "#3B82F6",
      tennis: "#EC4899",
      gym: "#8B5CF6",
      swimming: "#06B6D4",
      other: "#6B7280",
    };

    return colors[type] || colors.other;
  };

  // Calculate XP progress percentage
  const progressPercentage = (profile.xp / profile.xpToNextLevel) * 100;

  return (
    <div className="container">
      <h1 className="title">Sport ID</h1>

      {/* Profile Header */}
      <div className="card profile-header">
        <img
          src={profile.user.avatar || "/avatars/default.svg"}
          alt={profile.user.name}
          className="avatar"
        />
        <div>
          <h2>{profile.user.name}</h2>
          <p>Level {profile.level}</p>
          {profile.user.walletAddress ? (
            <div className="badge">
              {`${profile.user.walletAddress.substring(
                0,
                6
              )}...${profile.user.walletAddress.substring(
                profile.user.walletAddress.length - 4
              )}`}
            </div>
          ) : (
            <button
              className="button button-primary"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{profile.xp} XP</span>
          <span>{profile.xpToNextLevel} XP</span>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{profile.totalActivities}</div>
          <div className="stat-label">Total Activities</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{profile.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{profile.titles.length}</div>
          <div className="stat-label">Titles Earned</div>
        </div>
      </div>

      {/* Titles Section */}
      <h2 className="title">Earned Titles</h2>
      <div className="titles-grid">
        {profile.titles.map((title: TitleNFT) => (
          <div key={title.id} className="title-card">
            <img
              src={title.image || "/badges/default.png"}
              alt={title.name}
              className="title-image"
            />
            <div className="title-name">{title.name}</div>
            <div className="title-desc">{title.description}</div>
            <div className={`badge badge-${title.rarity}`}>{title.rarity}</div>
            <div className="title-desc">{formatDate(title.dateEarned)}</div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <h2 className="title">Recent Activities</h2>
      <div className="activities-list">
        {profile.recentActivities.map((activity: ActivityRecord) => (
          <div key={activity.id} className="activity-item">
            <div
              className="activity-icon"
              style={{ backgroundColor: getSportColor(activity.type) }}
            >
              {activity.type.charAt(0).toUpperCase()}
            </div>
            <div className="activity-details">
              <div className="activity-type">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                {activity.verified && (
                  <span
                    className="badge badge-verified"
                    style={{ marginLeft: "8px", fontSize: "0.7rem" }}
                  >
                    Verified
                  </span>
                )}
              </div>
              <div className="activity-meta">
                <span>{formatDate(activity.date)}</span>
                <span>{activity.duration} min</span>
                {activity.distance && <span>{activity.distance} km</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportID;
