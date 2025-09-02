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
  console.log("Seed OK");
}

main().finally(() => prisma.$disconnect());
