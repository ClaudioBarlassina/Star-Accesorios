const WEB_API_KEY = process.env.WEB_API_KEY;
const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const adminAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    if (!WEB_API_KEY) {
      return res.status(500).json({ error: "WEB_API_KEY no configurada" });
    }

    // verificar el ID token contra Firebase sin usar service account
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    const email = (data.users[0].email || "").toLowerCase();

    if (!adminEmails.includes(email)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    req.adminEmail = email;
    next();
  } catch (error) {
    console.error("❌ Error en adminAuth:", error.message);
    res.status(500).json({ error: "Error validando sesión" });
  }
};
