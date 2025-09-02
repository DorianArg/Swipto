import { prisma } from "@/lib/prisma";

export function getMonthKey(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // ex: 2025-09
}

export function getMonthRange(d = new Date()) {
  const start = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0, 0)
  );
  const end = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 999)
  );
  return { start, end };
}

export async function ensureSeasonForDate(d = new Date()) {
  const key = getMonthKey(d);
  const { start, end } = getMonthRange(d);
  const name = `Saison ${key}`;

  // Upsert par clé unique
  const season = await prisma.season.upsert({
    where: { key },
    create: { key, name, startsAt: start, endsAt: end },
    update: { name, startsAt: start, endsAt: end },
  });

  return season;
}
