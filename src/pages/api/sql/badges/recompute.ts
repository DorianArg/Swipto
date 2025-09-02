import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../../../../lib/firebaseAdmin";

// Placeholder endpoint for manual recomputation of badges
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const idToken = authHeader.split("Bearer ")[1];
    await admin.auth().verifyIdToken(idToken);
    // Real recomputation logic would go here.
    res.status(200).json({ status: "ok" });
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Invalid token" });
  }
}

