import {
  User,
  ActivityRecord,
  TitleNFT,
  SportProfile,
  Post,
  Challenge,
  MarketplaceItem,
  SportType,
} from "./types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Smith",
    avatar: "/avatars/user-alex.png",
    walletAddress: "0x1234...5678",
  },
  {
    id: "2",
    name: "Jessica Taylor",
    avatar: "/avatars/user-jessica.png",
    walletAddress: "0xabcd...efgh",
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "/avatars/user-michael.png",
  },
];

// Mock Activity Records
export const mockActivities: ActivityRecord[] = [
  {
    id: "act1",
    type: "running",
    date: "2023-05-01T08:30:00Z",
    duration: 45,
    distance: 5.2,
    verified: true,
  },
  {
    id: "act2",
    type: "basketball",
    date: "2023-04-30T17:15:00Z",
    duration: 60,
    verified: true,
  },
  {
    id: "act3",
    type: "gym",
    date: "2023-04-29T14:00:00Z",
    duration: 75,
    verified: true,
  },
  {
    id: "act4",
    type: "running",
    date: "2023-04-28T07:45:00Z",
    duration: 30,
    distance: 3.1,
    verified: true,
  },
  {
    id: "act5",
    type: "soccer",
    date: "2023-04-27T18:30:00Z",
    duration: 90,
    verified: true,
  },
];

// Mock Title NFTs
export const mockTitles: TitleNFT[] = [
  {
    id: "nft1",
    name: "Marathon Finisher",
    description: "Completed a full marathon distance",
    image: "/badges/marathon.png",
    dateEarned: "2023-03-15T10:30:00Z",
    rarity: "epic",
  },
  {
    id: "nft2",
    name: "100-Day Streak",
    description: "Completed activities for 100 consecutive days",
    image: "/badges/streak100.png",
    dateEarned: "2023-02-01T08:15:00Z",
    rarity: "legendary",
  },
  {
    id: "nft3",
    name: "Basketball All-Star",
    description: "Played 50 basketball games",
    image: "/badges/basketball.png",
    dateEarned: "2023-01-10T19:45:00Z",
    rarity: "rare",
  },
];

// Mock Sport Profile
export const mockSportProfile: SportProfile = {
  user: mockUsers[0],
  totalActivities: 127,
  streak: 42,
  titles: mockTitles,
  recentActivities: mockActivities,
  level: 24,
  xp: 12400,
  xpToNextLevel: 15000,
};

// Mock Social Feed Posts
export const mockPosts: Post[] = [
  {
    id: "post1",
    user: mockUsers[0],
    content: "Just crushed a 10K run! Personal best time 💪",
    images: ["/posts/running.png"],
    activityData: {
      type: "running",
      duration: 48,
      distance: 10,
      calories: 520,
    },
    likes: 24,
    comments: 3,
    timestamp: "2023-05-02T09:15:00Z",
    verified: true,
  },
  {
    id: "post2",
    user: mockUsers[1],
    content: "Great basketball session with the team today!",
    images: ["/posts/basketball.png"],
    video: "/posts/basketball-clip.mp4",
    activityData: {
      type: "basketball",
      duration: 75,
      calories: 650,
    },
    likes: 41,
    comments: 7,
    timestamp: "2023-05-01T18:30:00Z",
    verified: true,
  },
  {
    id: "post3",
    user: mockUsers[2],
    content: "Morning yoga to start the day right ✨",
    activityData: {
      type: "other",
      duration: 30,
      calories: 120,
    },
    likes: 18,
    comments: 2,
    timestamp: "2023-05-01T06:45:00Z",
    verified: false,
  },
];

// Mock Daily Challenges
export const mockChallenges: Challenge[] = [
  {
    id: "chl1",
    title: "5K Run Challenge",
    description: "Complete a 5K run today",
    duration: 30,
    sportType: "running",
    reward: {
      tokens: 50,
      xp: 200,
      badge: "/badges/5k-run.png",
    },
    participants: 237,
    deadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    joined: false,
  },
  {
    id: "chl2",
    title: "Full Body Workout",
    description: "Complete a 30-minute strength training session",
    duration: 30,
    sportType: "gym",
    reward: {
      tokens: 30,
      xp: 150,
    },
    participants: 124,
    deadline: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(), // 14 hours from now
    joined: true,
    completed: false,
  },
  {
    id: "chl3",
    title: "Basketball Shootout",
    description: "Play a game of basketball with friends",
    duration: 60,
    sportType: "basketball",
    reward: {
      tokens: 75,
      xp: 250,
      badge: "/badges/basketball-master.png",
    },
    participants: 89,
    deadline: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(), // 10 hours from now
    joined: false,
  },
];

// Mock Marketplace Items
export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "item1",
    name: "Ultra Runner Title",
    description: "Earned by completing 10 marathons",
    image: "/marketplace/ultra-runner.png",
    price: {
      amount: 500,
      currency: "token",
    },
    type: "title",
    rarity: "legendary",
    sportType: "running",
    soulbound: true,
  },
  {
    id: "item2",
    name: "Nike Runner Pack",
    description: "Special running challenge sponsored by Nike",
    image: "/marketplace/nike-runner.png",
    price: {
      amount: 200,
      currency: "points",
    },
    type: "challenge",
    rarity: "rare",
    sportType: "running",
    soulbound: false,
    sponsored: {
      brand: "Nike",
      logo: "/brands/nike-logo.png",
    },
  },
  {
    id: "item3",
    name: "Gym Warrior Badge",
    description: "Complete 50 gym workouts to earn",
    image: "/marketplace/gym-warrior.png",
    price: {
      amount: 0.05,
      currency: "ETH",
    },
    type: "badge",
    rarity: "epic",
    sportType: "gym",
    soulbound: true,
  },
  {
    id: "item4",
    name: "Under Armour Basketball Kit",
    description: "Limited edition digital gear from Under Armour",
    image: "/marketplace/ua-basketball.png",
    price: {
      amount: 75,
      currency: "USDC",
    },
    type: "gear",
    rarity: "rare",
    sportType: "basketball",
    soulbound: false,
    sponsored: {
      brand: "Under Armour",
      logo: "/brands/ua-logo.png",
    },
  },
];

// Sport type filters
export const sportTypeFilters: { label: string; value: SportType | "all" }[] = [
  { label: "All Sports", value: "all" },
  { label: "Running", value: "running" },
  { label: "Basketball", value: "basketball" },
  { label: "Soccer", value: "soccer" },
  { label: "Tennis", value: "tennis" },
  { label: "Gym", value: "gym" },
  { label: "Swimming", value: "swimming" },
  { label: "Other", value: "other" },
];
