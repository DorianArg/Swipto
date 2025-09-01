import type { NextApiRequest, NextApiResponse } from "next";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, cryptoData } = req.body;

    // Vérifier que les données sont présentes
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages manquants ou invalides" });
    }

    // Créer un prompt système plus simple
    const systemPrompt = `Tu es un assistant expert en cryptomonnaies. Tu aides l'utilisateur avec des questions sur ${
      cryptoData?.name || "les cryptomonnaies"
    }.

Informations actuelles:
- Crypto: ${cryptoData?.name || "N/A"} (${
      cryptoData?.symbol?.toUpperCase() || "N/A"
    })
- Prix: $${cryptoData?.current_price?.toLocaleString() || "N/A"}
- Variation 24h: ${
      cryptoData?.price_change_percentage_24h?.toFixed(2) || "N/A"
    }%

Réponds de façon claire et concise. Rappelle que ce ne sont pas des conseils financiers.`;

    // Formater les messages correctement
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    //DEBUG
    // console.log("Envoi vers Groq:", {
    //   messageCount: formattedMessages.length,
    //   cryptoName: cryptoData?.name,
    // });

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
      model: "llama-3.1-8b-instant", // Modèle vérifié
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      stream: false,
    });

    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("Aucune réponse générée");
    }

    //DEBUG
    // console.log("Réponse Groq reçue:", reply.substring(0, 50) + "...");

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Erreur détaillée Groq:", {
      message: error.message,
      status: error.status,
      error: error.error,
    });

    // Réponse d'erreur plus spécifique
    const errorMessage =
      error.status === 400
        ? "Erreur de format de requête"
        : error.status === 401
        ? "Clé API invalide"
        : error.status === 429
        ? "Limite de taux atteinte, réessayez dans quelques secondes"
        : "Erreur technique, réessayez";

    res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
}
