import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (!userId || typeof userId !== "string")
    return res.status(400).json({ error: "Missing userId" });

  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: "desc" },
    });

    return res.status(200).json({
      badges: userBadges.map((ub) => ({
        key: ub.badge.key,
        name: ub.badge.name,
        description: ub.badge.description,
        icon: ub.badge.icon,
        unlockedAt: ub.unlockedAt,
      })),
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
