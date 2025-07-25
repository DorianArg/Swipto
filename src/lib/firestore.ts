// src/lib/firestore.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "firebase/auth";

export const createUserIfNotExists = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      preferredAmount: 1000, // Montant investi par défaut
      wallet: [],
      filters: {
        categories: [],
        volatility: "any",
        volumeMin: 0,
      },
    });
    console.log("Nouvel utilisateur créé dans Firestore !");
  } else {
    console.log("Utilisateur déjà existant.");
  }
};
