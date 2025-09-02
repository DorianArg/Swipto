import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ensureSeasonForDate } from "@/lib/season";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const secret = req.headers["x-admin-key"];
  if (!secret || secret !== process.env.RECOMPUTE_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { seasonKey } = req.query;

  try {
    // Trouver la saison cible (par clé) ou assurer la saison du mois courant
    let season = null as any;
    if (seasonKey && typeof seasonKey === "string") {
      season = await prisma.season.findUnique({ where: { key: seasonKey } });
      if (!season) return res.status(404).json({ error: "Season not found" });
    } else {
      season = await ensureSeasonForDate(new Date());
    }
    const start = new Date(season.startsAt);
    const end = new Date(season.endsAt);

    // Agréger depuis Firestore
    const usersSnap = await getDocs(collection(db, "users"));
    const counts = new Map<string, number>();

    usersSnap.forEach((doc) => {
      const data = doc.data();
      const swiped = (data?.swipedCryptos || []) as any[];
      for (const s of swiped) {
        if (s?.swipe_type !== "like") continue;
        // timestamp sauvegardé côté Firestore: ISO string
        const ts = s?.timestamp ? new Date(s.timestamp) : null;
        if (!ts || ts < start || ts > end) continue;

        const coinId = s?.id || s?.coinId;
        if (!coinId) continue;
        counts.set(coinId, (counts.get(coinId) || 0) + 1);
      }
    });

    // Reset et insertion en SQL
    await prisma.seasonLike.deleteMany({ where: { seasonId: season.id } });

    if (counts.size > 0) {
      await prisma.seasonLike.createMany({
        data: Array.from(counts.entries()).map(([coinId, likes]) => ({
          seasonId: season.id,
          coinId,
          likes,
        })),
      });
    }

    return res.status(200).json({
      ok: true,
      season: { key: season.key },
      updated: counts.size,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
