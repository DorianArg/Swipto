import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { season = "current", limit = "20" } = req.query;
    const take = parseInt(limit as string, 10);
    const now = new Date();

    const seasonRecord =
      season === "current"
        ? await prisma.season.findFirst({
            where: {
              startAt: { lte: now },
              endAt: { gte: now },
            },
          })
        : await prisma.season.findUnique({
            where: { id: season as string },
          });

    if (!seasonRecord) {
      return res.status(404).json({ error: "Season not found" });
    }

    const likes = await prisma.seasonLike.findMany({
      where: { seasonId: seasonRecord.id },
      orderBy: { likeCount: "desc" },
      take,
      include: { coin: true },
    });

    const data = likes.map((l) => ({
      coinId: l.coinId,
      likeCount: l.likeCount,
      coin: {
        id: l.coin.id,
        symbol: l.coin.symbol,
        name: l.coin.name,
      },
    }));

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}

