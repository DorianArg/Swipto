// ==============================================
// Imports
// ==============================================
import React from "react";

// ==============================================
// Props
// ==============================================
type Props = {
  rank: number; // Position in leaderboard
  name: string; // Coin name
  symbol: string; // Coin symbol
  likeCount: number; // Number of likes/superlikes
};

// ==============================================
// Component
// ==============================================
export default function LeaderboardCard({ rank, name, symbol, likeCount }: Props) {
  return (
    <div className="flex gap-2" data-testid="leaderboard-card">
      {/* Rank indicator */}
      <span>{rank}.</span>

      {/* Coin name and symbol */}
      <span>
        {name} ({symbol})
      </span>

      {/* Total likes */}
      <span>{likeCount} likes</span>
    </div>
  );
}
