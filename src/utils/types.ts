// User Profile Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
}

// Sport ID Types
export interface ActivityRecord {
  id: string;
  type: SportType;
  date: string;
  duration: number; // in minutes
  distance?: number; // in km/miles
  verified: boolean;
  verificationSource?: 'manual' | 'screenshot' | 'api';
  calories?: number;
  pace?: number; // in min/km or min/mile
  screenshot?: string; // base64 encoded image
}

export interface TitleNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  dateEarned: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SportProfile {
  user: User;
  totalActivities: number;
  streak: number;
  titles: TitleNFT[];
  recentActivities: ActivityRecord[];
  level: number;
  xp: number;
  xpToNextLevel: number;
}

// Social Feed Types
export type SportType = 'running' | 'basketball' | 'soccer' | 'tennis' | 'gym' | 'swimming' | 'other';

export interface Post {
  id: string;
  user: User;
  content: string;
  images?: string[];
  video?: string;
  activityData?: {
    type: SportType;
    duration?: number;
    distance?: number;
    calories?: number;
    verified?: boolean;
    verificationSource?: 'manual' | 'screenshot' | 'api';
  };
  likes: number;
  comments: number;
  timestamp: string;
  verified: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
}

// Daily Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  sportType: SportType;
  reward: {
    tokens: number;
    xp: number;
    badge?: string;
  };
  participants: number;
  deadline: string;
  completed?: boolean;
  joined?: boolean;
}

// Marketplace Types
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: {
    amount: number;
    currency: 'ETH' | 'USDC' | 'token' | 'points';
  };
  type: 'title' | 'badge' | 'challenge' | 'gear';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  sportType: SportType | 'all';
  soulbound: boolean;
  sponsored?: {
    brand: string;
    logo: string;
  };
}

// Screenshot Analyzer Types
export interface ExtractedActivityData {
  type?: SportType;
  duration?: number; // in minutes
  distance?: number; // in km/miles
  calories?: number;
  pace?: number; // in min/km
  date?: string; // ISO string
  confidence: number; // 0-100
}

export interface AnalysisResult {
  extractedData: ExtractedActivityData;
  screenshot: string; // base64 encoded image
}

export type ActivityField = 'type' | 'duration' | 'distance' | 'calories' | 'pace' | 'date'; 