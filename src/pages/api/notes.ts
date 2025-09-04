import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { title, content } = req.body || {};
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }
      // ⚠️ Assure-toi d'avoir un modèle Note dans Prisma (voir plus bas)
      const note = await prisma.note.create({ data: { title, content } });
      return res.status(201).json({ message: "ok", note });
    }

    if (req.method === "GET") {
      const notes = await prisma.note.findMany({
        orderBy: { id: "desc" },
      });
      return res.status(200).json({ notes });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
