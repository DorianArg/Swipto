// ==============================================
// Imports
// ==============================================
import prisma from "../lib/prisma";

// ==============================================
// Types
// ==============================================
export type LeaderboardItem = {
  rank: number; // Position in the leaderboard
  coinId: string; // Identifier of the coin
  symbol: string; // Short symbol (e.g. BTC)
  name: string; // Human readable name
  category: string | null; // Optional category
  likeCount: number; // Total number of likes/superlikes
};

// ==============================================
// Service
// ==============================================
/**
 * Aggregate likes and superlikes per coin and return a ranked leaderboard.
 */
export async function getLeaderboard(limit: number): Promise<LeaderboardItem[]> {
  // Step 1: group swipes by coin and count likes/superlikes
  const grouped = await prisma.swipe.groupBy({
    by: ["coinId"],
    where: { action: { in: ["like", "superlike"] } },
    _count: { coinId: true },
    orderBy: { _count: { coinId: "desc" } },
    take: limit,
  });

  // Early return if no swipes were found
  if (grouped.length === 0) return [];

  // Step 2: fetch coin metadata for the grouped IDs
  const coinIds = grouped.map((g) => g.coinId);
  const coins = await prisma.coin.findMany({
    where: { id: { in: coinIds } },
    select: { id: true, symbol: true, name: true, category: true },
  });
  const coinMap = new Map(coins.map((c) => [c.id, c]));

  // Step 3: merge metadata with counts and compute rank
  return grouped.map((g, i) => {
    const coin = coinMap.get(g.coinId);
    return {
      rank: i + 1,
      coinId: coin?.id ?? g.coinId,
      symbol: coin?.symbol ?? g.coinId.toUpperCase(),
      name: coin?.name ?? g.coinId,
      category: coin?.category ?? null,
      likeCount: g._count.coinId,
    };
  });
}
