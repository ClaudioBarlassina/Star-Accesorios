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
      console.warn("⚠️ adminAuth: No se proporcionó token de autenticación");
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    if (!WEB_API_KEY) {
      console.error("❌ adminAuth: Variable WEB_API_KEY no configurada en el servidor");
      return res.status(500).json({ error: "WEB_API_KEY no configurada en el servidor. Verificá las variables de entorno en Render." });
    }

    if (!adminEmails.length) {
      console.error("❌ adminAuth: Variable ADMIN_EMAILS no configurada o vacía en el servidor");
      return res.status(500).json({ error: "ADMIN_EMAILS no configurado en el servidor. Verificá las variables de entorno en Render." });
    }

    // verificar el ID token contra Firebase con timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${WEB_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
          signal: controller.signal,
        }
      );
    } catch (fetchError) {
      clearTimeout(timeout);
      console.error("❌ adminAuth: Error conectando con Firebase Identity Toolkit:", fetchError.message);
      return res.status(500).json({ error: "No se pudo conectar con el servicio de autenticación. Intentá de nuevo." });
    }
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      console.warn("⚠️ adminAuth: Token inválido o expirado. Status Firebase:", response.status);
      return res.status(401).json({ error: "Token inválido o expirado. Refrescá la página e iniciá sesión de nuevo." });
    }

    const email = (data.users[0].email || "").toLowerCase();

    if (!adminEmails.includes(email)) {
      console.warn("⚠️ adminAuth: Email no autorizado:", email);
      return res.status(403).json({ error: "No autorizado. Tu email no está en la lista de administradores." });
    }

    req.adminEmail = email;
    next();
  } catch (error) {
    console.error("❌ adminAuth: Error inesperado:", error.message, error.stack);
    res.status(500).json({ error: "Error validando sesión. Revisá los logs del servidor." });
  }
};
