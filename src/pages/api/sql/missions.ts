import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const LIKE_CHALLENGE_KEY = "like_24h";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (!userId || typeof userId !== "string")
    return res.status(400).json({ error: "Missing userId" });

  try {
    const [badges, progress, userBadges] = await Promise.all([
      prisma.badge.findMany({ orderBy: { target: "asc" } }),
      prisma.challengeProgress.findUnique({
        where: { userId_key: { userId, key: LIKE_CHALLENGE_KEY } },
      }),
      prisma.userBadge.findMany({ where: { userId }, select: { badgeId: true } }),
    ]);

    const unlockedSet = new Set(userBadges.map((b) => b.badgeId));
    const count = progress?.count ?? 0;

    const missions = badges.map((b) => ({
      code: b.key,
      label: b.name,
      description: b.description,
      target: b.target,
      progress: count,
      icon: b.icon,
      completed: count >= b.target,
      unlocked: unlockedSet.has(b.id),
    }));

    return res.status(200).json({ missions });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
