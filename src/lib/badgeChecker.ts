import prisma from "./prisma";

type Rules = {
  like_count_24h?: number;
  like_defi?: number;
};

export async function checkBadgesForUser(userId: string) {
  const now = new Date();
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const likes24h = await prisma.swipe.count({
    where: {
      userId,
      action: { in: ["like", "superlike"] },
      createdAt: { gte: since },
    },
  });

  const badges = await prisma.badge.findMany();

  for (const badge of badges) {
    const rules = badge.ruleJson as Rules;
    let ok = true;

    if (rules.like_count_24h && likes24h < rules.like_count_24h) {
      ok = false;
    }
    // Additional rules (e.g., like_defi) would be computed here

    if (ok) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        update: {},
        create: { userId, badgeId: badge.id },
      });
    }
  }
}

