// ==============================================
// Imports
// ==============================================
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

// ==============================================
// Response Types
// ==============================================
export type LeaderboardItem = {
  rank: number;
  coinId: string;
  symbol: string;
  name: string;
  category: string | null;
  likeCount: number;
};

export type LeaderboardResponse =
  | { success: true; data: LeaderboardItem[]; total: number }
  | { success: false; error: string };

// ==============================================
// API Route Handler
// ==============================================
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse>
) {
  try {
    // Reject any method other than GET
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res
        .status(405)
        .json({ success: false, error: "Method Not Allowed" });
    }

    // Disable caching to always serve fresh leaderboard data
    res.setHeader("Cache-Control", "no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");

    // Extract and sanitize the limit parameter (default 20, max 100)
    const limitRaw = String(req.query.limit ?? "20");
    const parsed = parseInt(limitRaw, 10);
    const limit = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 1), 100)
      : 20;

    // LIKE uniquement par défaut. Passer includeSuperlike=1 pour compter aussi les superlikes
    const includeSuperlikeParam = String(
      req.query.includeSuperlike ?? "0"
    ).toLowerCase();
    const includeSuperlike = !(
      includeSuperlikeParam === "0" || includeSuperlikeParam === "false"
    );
    const actions = includeSuperlike ? ["like", "superlike"] : ["like"];

    // Agrégation
    const grouped = await prisma.swipe.groupBy({
      by: ["coinId"],
      where: { action: { in: actions } },
      _count: { coinId: true }, // <- on compte sur coinId
      orderBy: { _count: { coinId: "desc" } },
      take: limit,
    });

    if (grouped.length === 0) {
      return res.status(200).json({ success: true, data: [], total: 0 });
    }

    const coinIds = grouped.map((g) => g.coinId);
    const coins = await prisma.coin.findMany({
      where: { id: { in: coinIds } },
      select: { id: true, symbol: true, name: true, category: true },
    });
    const coinMap = new Map(coins.map((c) => [c.id, c]));

    const data: LeaderboardItem[] = grouped.map((g, i) => {
      const coin = coinMap.get(g.coinId);
      return {
        rank: i + 1,
        coinId: coin?.id ?? g.coinId,
        symbol: coin?.symbol ?? g.coinId.toUpperCase(),
        name: coin?.name ?? g.coinId,
        category: coin?.category ?? null,
        likeCount: g._count.coinId, // ✅ le bon champ
      };
    });

    // Respond with aggregated data
    return res.status(200).json({ success: true, data, total: data.length });
  } catch (e) {
    console.error("[api/leaderboard] error:", e);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération du leaderboard",
    });
  }
}
