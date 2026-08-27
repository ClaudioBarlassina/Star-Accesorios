import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  let serviceAccount = null;

  const serviceAccountPath = join(__dirname, "..", "..", "star-accesorios-f0365-firebase-adminsdk-fbsvc-c545fc6552.json");

  if (existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn("⚠️ No se encontró la Service Account de Firebase. El endpoint /api/users no funcionará.");
  }
}

export const firebaseAuth = admin.apps.length ? admin.auth() : null;
