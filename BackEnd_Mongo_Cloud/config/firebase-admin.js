import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  const serviceAccountPath = join(__dirname, "..", "..", "star-accesorios-f0365-firebase-adminsdk-fbsvc-c545fc6552.json");
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAuth = admin.auth();
