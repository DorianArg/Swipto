// src/lib/firebase.ts
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { User } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Firebase avec variables d'environnement
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialisation Firebase (évite la duplication)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export des services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// Créer un utilisateur s'il n'existe pas
export const createUserIfNotExists = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        // Wallet et investissements
        realWallet: 2430.5, // Wallet initial
        totalInvested: 0,
        swipeAmount: 100, // Montant par swipe par défaut
        // Collections de cryptos
        swipedCryptos: [], // Cryptos likées (investissements)
        favoriteCryptos: [], // Cryptos ajoutées aux favoris

        // Préférences et filtres
        preferredAmount: 100,
        filters: {
          category: null,
          top: 100,
          priceMin: null,
          priceMax: null,
          volumeMin: null,
          volumeMax: null,
        },
      });
      console.log("Nouvel utilisateur créé dans Firestore !");
    } else {
      console.log("Utilisateur déjà existant.");
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    throw error;
  }
};

// Sauvegarder un swipe de crypto
export const saveCryptoSwipe = async (
  userId: string,
  crypto: any,
  swipeType: "like" | "superlike",
  swipeAmount: number = 100
) => {
  try {
    console.log("Attempting to save crypto swipe...", {
      userId,
      cryptoId: crypto.id,
      swipeType,
    });

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document does not exist:", userId);
      throw new Error("Utilisateur non trouvé");
    }

    const userData = userSnap.data();
    const cryptoData = {
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol?.toUpperCase(),
      image: crypto.image,
      price: crypto.current_price || crypto.price,
      trend:
        crypto.price_change_percentage_24h > 0
          ? `+${crypto.price_change_percentage_24h.toFixed(2)}%`
          : `${crypto.price_change_percentage_24h.toFixed(2)}%`,
      invested_amount: swipeAmount,
      timestamp: new Date().toISOString(),
      swipe_type: swipeType,
    };

    console.log("Crypto data to save:", cryptoData);

    if (swipeType === "like") {
      // Ajouter aux investissements
      await updateDoc(userRef, {
        swipedCryptos: arrayUnion(cryptoData),
        totalInvested: (userData.totalInvested || 0) + swipeAmount,
      });
      console.log("Crypto saved to investments");
    } else if (swipeType === "superlike") {
      // Ajouter aux favoris
      await updateDoc(userRef, {
        favoriteCryptos: arrayUnion(cryptoData),
      });
      console.log("Crypto saved to favorites");
    }

    console.log("Crypto swipe saved successfully!");
  } catch (error) {
    console.error("Erreur détaillée lors de la sauvegarde :", error);
    throw error;
  }
};

// Récupérer les données utilisateur
export const getUserData = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données utilisateur:",
      error
    );
    throw error;
  }
};

// Mettre à jour les préférences utilisateur
export const updateUserPreferences = async (
  userId: string,
  preferences: any
) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, preferences);
    console.log("Préférences utilisateur mises à jour");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des préférences:", error);
    throw error;
  }
};

// Mettre à jour le montant de swipe
export const updateSwipeAmount = async (userId: string, amount: number) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      swipeAmount: amount,
    });
    console.log("Montant de swipe mis à jour:", amount);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du montant:", error);
    throw error;
  }
};

// Supprimer une crypto des favoris ou investissements
export const removeCryptoFromCollection = async (
  userId: string,
  cryptoId: string,
  collectionType: "swipedCryptos" | "favoriteCryptos"
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const collection = userData[collectionType] || [];
      const updatedCollection = collection.filter(
        (crypto: any) => crypto.id !== cryptoId
      );

      await updateDoc(userRef, {
        [collectionType]: updatedCollection,
      });

      console.log(`Crypto supprimée de ${collectionType}`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
};

// Mettre à jour les filtres utilisateur
export const updateUserFilters = async (userId: string, filters: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      filters: filters,
    });
    console.log("Filtres utilisateur mis à jour");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des filtres:", error);
    throw error;
  }
};
