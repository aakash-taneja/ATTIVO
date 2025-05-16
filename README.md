# ATTIVO Sports Platform

A decentralized sports/fitness platform with blockchain integration for verified athletic activities, rewards, and achievements.

## Components

### SportID
A non-transferable, on-chain athletic profile that logs a user's verified sports activity and growth.
- Tracks verified activities (running, basketball, gym workouts, etc.)
- Assigns Title NFTs for major milestones
- Profile is soulbound (tied to identity and can't be sold)

### SocialFeed
A place for users to share moments, post training logs, and interact with the community.
- Users can post text, images, or video of their active moments
- Each post can earn interaction points based on engagement
- Posts are tagged by sport type

### DailyChallenge
A daily opt-in movement task system that rewards consistency and sweat equity.
- Users commit to daily 30-minute activity blocks
- Validators confirm completion
- If completed, they receive rewards (tokens, badges)
- If failed, they forfeit staked tokens

### Marketplace
A decentralized shop for Title NFTs, profile upgrades, and sponsored items.
- Users buy verified Title NFTs (non-tradable soulbound tokens)
- Browse sponsored gear, limited merch, or athlete-branded assets
- Allows token usage to unlock upgrades or special challenges

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- React.js
- Next.js
- TypeScript
- Ethers.js for blockchain integration
- CSS for styling 