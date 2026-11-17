
require("dotenv").config();

const {
  initializeApp,
  getApps,
  applicationDefault,
} = require("firebase-admin/app");

const {
  getFirestore,
} = require("firebase-admin/firestore");

// Inicializar Firebase solo una vez
if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// Conexión a Firestore
const db = getFirestore();

module.exports = { db };
