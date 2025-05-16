import React, { useState, useEffect } from 'react';
import { Challenge } from '../utils/types';
import { mockChallenges } from '../utils/mockData';
import { joinChallenge } from '../utils/blockchain';
// CSS is imported globally in _app.tsx

interface DailyChallengeProps {
  initialChallenges?: Challenge[];
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ initialChallenges = mockChallenges }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [timeLeft, setTimeLeft] = useState<Record<string, { hours: number; minutes: number; seconds: number }>>({});

  // Calculate time left for each challenge
  useEffect(() => {
    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [challenges]);
  
  const calculateTimeLeft = () => {
    const newTimeLeft: Record<string, { hours: number; minutes: number; seconds: number }> = {};
    
    challenges.forEach(challenge => {
      const difference = new Date(challenge.deadline).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        newTimeLeft[challenge.id] = { hours, minutes, seconds };
      } else {
        newTimeLeft[challenge.id] = { hours: 0, minutes: 0, seconds: 0 };
      }
    });
    
    setTimeLeft(newTimeLeft);
  };
  
  // Join a challenge
  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const success = await joinChallenge(challengeId);
      
      if (success) {
        setChallenges(challenges.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, joined: true } 
            : challenge
        ));
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };
  
  // Get icon/color based on sport type
  const getSportColor = (type: string): string => {
    const colors: Record<string, string> = {
      running: '#10B981',
      basketball: '#F59E0B',
      soccer: '#3B82F6',
      tennis: '#EC4899',
      gym: '#8B5CF6',
      swimming: '#06B6D4',
      other: '#6B7280'
    };
    
    return colors[type] || colors.other;
  };
  
  // Format time with padding
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };
  
  return (
    <div className="container">
      <h1 className="title">Daily Challenges</h1>
      
      {challenges.map(challenge => (
        <div 
          key={challenge.id} 
          className={`challenge-card ${challenge.joined ? 'active' : ''}`}
        >
          {/* Status indicator */}
          {challenge.joined && (
            <div className={`challenge-status ${challenge.completed ? 'completed' : 'joined'}`}>
              {challenge.completed ? 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg> : 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                </svg>
              }
            </div>
          )}
          
          {/* Header */}
          <div className="challenge-header">
            <div>
              <div className="challenge-title">{challenge.title}</div>
              <div className="challenge-type" style={{ color: getSportColor(challenge.sportType) }}>
                {challenge.sportType.charAt(0).toUpperCase() + challenge.sportType.slice(1)}
              </div>
            </div>
            <div className="challenge-participants">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '4px' }}>
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
              </svg>
              {challenge.participants}
            </div>
          </div>
          
          {/* Description */}
          <div className="challenge-description">{challenge.description}</div>
          
          {/* Rewards */}
          <div className="challenge-rewards">
            <div className="challenge-reward">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#F59E0B" viewBox="0 0 16 16">
                <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                <path d="M4 1.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm-2 4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4 3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1.5 2.5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6z"/>
              </svg>
              {challenge.reward.tokens} Tokens
            </div>
            <div className="challenge-reward">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#3B82F6" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm2.376 3.79a.5.5 0 0 1-.708.707L1.5 10.793l-1.47 1.471A.5.5 0 1 1-.677 11.6l2-2a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1 .354.146Zm10.354-4.5a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 9.293l2.646-2.647a.5.5 0 0 1 .708 0Z"/>
              </svg>
              {challenge.reward.xp} XP
            </div>
            {challenge.reward.badge && (
              <div className="challenge-reward">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#8B5CF6" viewBox="0 0 16 16">
                  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                </svg>
                Badge
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="challenge-footer">
            {timeLeft[challenge.id] && (
              <div className="challenge-timer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z"/>
                  <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z"/>
                </svg>
                <span className="timer-value">{formatTime(timeLeft[challenge.id].hours)}</span>:
                <span className="timer-value">{formatTime(timeLeft[challenge.id].minutes)}</span>:
                <span className="timer-value">{formatTime(timeLeft[challenge.id].seconds)}</span>
              </div>
            )}
            
            {!challenge.joined ? (
              <button 
                className="button button-primary" 
                onClick={() => handleJoinChallenge(challenge.id)}
              >
                Join Challenge
              </button>
            ) : challenge.completed ? (
              <button className="button button-success" disabled>
                Completed
              </button>
            ) : (
              <button className="button button-secondary">
                Mark Complete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyChallenge; 