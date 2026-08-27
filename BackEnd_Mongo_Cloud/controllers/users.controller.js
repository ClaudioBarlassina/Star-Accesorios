import { firebaseAuth } from "../config/firebase-admin.js";

export const getUsers = async (req, res) => {
  if (!firebaseAuth) {
    return res.status(503).json({ error: "Firebase Admin no está configurado en este servidor." });
  }

  try {
    const listResult = await firebaseAuth.listUsers();
    const users = listResult.users.map((u) => ({
      uid: u.uid,
      email: u.email || "",
      displayName: u.displayName || "",
      creationTime: u.metadata.creationTime || null,
      lastSignInTime: u.metadata.lastSignInTime || null,
    }));

    users.sort((a, b) => {
      const dateA = a.lastSignInTime ? new Date(a.lastSignInTime) : new Date(0);
      const dateB = b.lastSignInTime ? new Date(b.lastSignInTime) : new Date(0);
      return dateB - dateA;
    });

    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios de Firebase:", error.message);
    res.status(500).json({ error: "Error al cargar los usuarios." });
  }
};
