const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");

// Check if credentials are provided via individual environment variables
if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  // Handle escaped newline characters in the private key string
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
  console.log("Firebase Admin SDK initialized using individual .env credentials");
} else {
  // Fallback: Check for serviceAccountKey.json file path
  const keyPathSetting = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "./serviceAccountKey.json";
  const serviceAccountPath = path.resolve(__dirname, "..", keyPathSetting);

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log(`Firebase Admin SDK initialized using: ${serviceAccountPath}`);
  } else {
    try {
      if (!getApps().length) {
        initializeApp();
      }
      console.log("Firebase Admin SDK initialized with default credentials");
    } catch (err) {
      console.warn(
        "Warning: Firebase credentials not found. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your .env file."
      );
    }
  }
}

const db = getFirestore();

module.exports = { db, FieldValue };
