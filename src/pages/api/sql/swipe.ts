import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

const LIKE_CHALLENGE_KEY = "like_24h";
const WINDOW_HOURS = 24;

function isWithinWindow(date: Date, hours: number) {
  return Date.now() - date.getTime() < hours * 60 * 60 * 1000;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { userId, coinId, action } = req.body || {};
  if (!userId || !coinId)
    return res.status(400).json({ error: "Missing userId or coinId" });

  try {
    const now = new Date();

    await prisma.swipe.create({
      data: { userId, coinId, action: action || "like", createdAt: now },
    });

    // On ne compte que les "likes" pour la gamification
    if (action && action !== "like")
      return res.status(200).json({ ok: true, skipped: true });

    // 1) Progression du challenge 24h
    const existing = await prisma.challengeProgress.findUnique({
      where: { userId_key: { userId, key: LIKE_CHALLENGE_KEY } },
    });

    const progress =
      !existing || !isWithinWindow(existing.periodStart, WINDOW_HOURS)
        ? await prisma.challengeProgress.upsert({
            where: { userId_key: { userId, key: LIKE_CHALLENGE_KEY } },
            create: {
              userId,
              key: LIKE_CHALLENGE_KEY,
              count: 1,
              periodStart: now,
            },
            update: { count: 1, periodStart: now },
          })
        : await prisma.challengeProgress.update({
            where: { userId_key: { userId, key: LIKE_CHALLENGE_KEY } },
            data: { count: { increment: 1 } },
          });

    // 2) Débloquer les badges (tous ceux windowHours=24 et target <= count)
    const badges = await prisma.badge.findMany({
      where: { windowHours: WINDOW_HOURS },
      orderBy: { target: "asc" },
    });

    const unlocked: string[] = [];
    for (const b of badges) {
      if (progress.count >= b.target) {
        const already = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: b.id } },
        });
        if (!already) {
          await prisma.userBadge.create({ data: { userId, badgeId: b.id } });
          unlocked.push(b.key);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      progress: { key: progress.key, count: progress.count },
      unlockedBadges: unlocked,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
