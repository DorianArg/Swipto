import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { limit } = req.query;
  const top = Number(limit || 10);

  try {
    const rows = await prisma.swipe.groupBy({
      by: ["coinId"],
      where: { action: { in: ["like", "superlike"] } },
      _count: { coinId: true },
      orderBy: { _count: { coinId: "desc" } },
      take: top,
    });

    return res.status(200).json({
      leaderboard: rows.map((r) => ({ coinId: r.coinId, likes: r._count.coinId })),
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
