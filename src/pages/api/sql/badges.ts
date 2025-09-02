import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../lib/firebaseAdmin";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    const userId = decoded.uid;

    const badges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    const data = badges.map((b) => ({
      id: b.badge.id,
      code: b.badge.code,
      label: b.badge.label,
      icon: b.badge.icon,
      unlockedAt: b.unlockedAt,
    }));

    res.status(200).json(data);
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token" });
  }
}

