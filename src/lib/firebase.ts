// src/lib/firebase.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Utilise les variables d'environnement (protège tes clés)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Empêche d'initialiser Firebase plusieurs fois (évite l’erreur app/duplicate-app)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Exporte Auth et Firestore pour le projet
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createUserIfNotExists = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      preferredAmount: 10, // Montant investi par défaut
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
