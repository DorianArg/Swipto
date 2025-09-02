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
    const progress = await prisma.challengeProgress.findMany({
      where: { userId },
      orderBy: { periodStart: "desc" },
    });
    return res.status(200).json({ progress });
  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
