
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeV2wnCQltFV7nPwUAYzjdwbc3lZYMra8",
  authDomain: "estacionamiento-4e71a.firebaseapp.com",
  projectId: "estacionamiento-4e71a",
  storageBucket: "estacionamiento-4e71a.firebasestorage.app",
  messagingSenderId: "198624241296",
  appId: "1:198624241296:web:0b64a685908e94d6d51a15",
};

// Inicializar Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Inicializar Authentication
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Inicializar Firestore
const db = getFirestore(app);

// Exportar servicios
export { app, auth, db };
