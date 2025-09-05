// ==============================================
// Imports
// ==============================================
import type { NextApiRequest, NextApiResponse } from "next";
import { getLeaderboard, LeaderboardItem } from "@/api/leaderboard";

// ==============================================
// Response Types
// ==============================================
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

    // Retrieve ranked coins
    const data = await getLeaderboard(limit);

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
