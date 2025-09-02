import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { seasonKey, limit } = req.query;
  const top = Number(limit || 20);

  try {
    let season = null;
    if (seasonKey && typeof seasonKey === "string") {
      season = await prisma.season.findUnique({ where: { key: seasonKey } });
    } else {
      const now = new Date();
      season = await prisma.season.findFirst({
        where: { startsAt: { lte: now }, endsAt: { gte: now } },
      });
    }
    if (!season) return res.status(404).json({ error: "Season not found" });

    const rows = await prisma.seasonLike.findMany({
      where: { seasonId: season.id },
      orderBy: { likes: "desc" },
      take: top,
    });

    return res.status(200).json({
      season: { key: season.key, name: season.name },
      leaderboard: rows.map((r) => ({ coinId: r.coinId, likes: r.likes })),
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
