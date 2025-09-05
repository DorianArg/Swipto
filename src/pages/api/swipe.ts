import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { mapToCoin, mapToSwipe, type SwipedCrypto } from "../../lib/coinMapper";

type Body = {
  userId: string;
  swipedCrypto: SwipedCrypto;
};

type SwipeResponse = { success: true } | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SwipeResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { userId, swipedCrypto } = req.body as Body;

    if (!userId || !swipedCrypto?.id || !swipedCrypto?.swipe_type) {
      return res.status(400).json({
        success: false,
        error: "Champs requis: userId, swipedCrypto.{id, swipe_type}",
      });
    }

    if (!["like", "superlike", "dislike"].includes(swipedCrypto.swipe_type)) {
      return res
        .status(400)
        .json({ success: false, error: "swipe_type invalide" });
    }

    // Upsert du coin
    const coin = mapToCoin(swipedCrypto);
    await prisma.coin.upsert({
      where: { id: coin.id },
      update: {
        symbol: coin.symbol,
        name: coin.name,
        category: coin.category,
      },
      create: coin,
    });

    // Création du swipe
    const swipe = mapToSwipe(userId, swipedCrypto);
    await prisma.swipe.create({ data: swipe });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("[api/swipe] error:", e);
    return res
      .status(500)
      .json({
        success: false,
        error: "Erreur serveur lors de l'enregistrement du swipe",
      });
  }
}
