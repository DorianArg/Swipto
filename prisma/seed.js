const { PrismaClient } = require("../src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const badges = [
    {
      key: "like_10_24h",
      name: "10 likes en 24h",
      description: "Atteins 10 likes en 24h",
      target: 10,
      windowHours: 24,
      icon: "ThumbsUp",
    },
    {
      key: "like_50_24h",
      name: "50 likes en 24h",
      description: "Atteins 50 likes en 24h",
      target: 50,
      windowHours: 24,
      icon: "Medal",
    },
    {
      key: "like_100_24h",
      name: "100 likes en 24h",
      description: "Atteins 100 likes en 24h",
      target: 100,
      windowHours: 24,
      icon: "Trophy",
    },
  ];

  for (const b of badges) {
    await prisma.badge.upsert({
      where: { key: b.key },
      create: b,
      update: {
        name: b.name,
        description: b.description,
        target: b.target,
        windowHours: b.windowHours,
        icon: b.icon,
      },
    });
  }

  // Assurer la saison du mois courant
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `${y}-${m}`;
  const start = new Date(Date.UTC(y, now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(y, now.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  await prisma.season.upsert({
    where: { key },
    create: { key, name: `Saison ${key}`, startsAt: start, endsAt: end },
    update: { name: `Saison ${key}`, startsAt: start, endsAt: end },
  });

  console.log("Seed OK");
}

main().finally(() => prisma.$disconnect());
