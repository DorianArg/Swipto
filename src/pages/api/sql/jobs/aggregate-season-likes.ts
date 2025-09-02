import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = req.headers["x-cron-key"];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const now = new Date();
    const season = await prisma.season.findFirst({
      where: {
        startAt: { lte: now },
        endAt: { gte: now },
      },
    });

    if (!season) {
      return res.status(404).json({ error: "No active season" });
    }

    const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const grouped = await prisma.swipe.groupBy({
      by: ["coinId"],
      where: {
        action: { in: ["like", "superlike"] },
        createdAt: { gte: since },
      },
      _count: { coinId: true },
    });

    await Promise.all(
      grouped.map((g) =>
        prisma.seasonLike.upsert({
          where: {
            seasonId_coinId: { seasonId: season.id, coinId: g.coinId },
          },
          update: { likeCount: g._count.coinId },
          create: {
            seasonId: season.id,
            coinId: g.coinId,
            likeCount: g._count.coinId,
          },
        }),
      ),
    );

    res.status(200).json({ updated: grouped.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}

