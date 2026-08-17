const WEB_API_KEY = process.env.WEB_API_KEY;

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      req.userId = null;
      return next();
    }

    if (!WEB_API_KEY) {
      return res.status(500).json({ error: "WEB_API_KEY no configurada en el servidor." });
    }

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
      console.error("❌ auth: Error conectando con Firebase:", fetchError.message);
      return res.status(500).json({ error: "No se pudo conectar con el servicio de autenticación." });
    }
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      return res.status(401).json({ error: "Token inválido o expirado." });
    }

    req.userId = data.users[0].localId;
    req.userEmail = (data.users[0].email || "").toLowerCase();
    next();
  } catch (error) {
    console.error("❌ auth: Error inesperado:", error.message);
    res.status(500).json({ error: "Error validando sesión." });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado." });
    }

    if (!WEB_API_KEY) {
      return res.status(500).json({ error: "WEB_API_KEY no configurada en el servidor." });
    }

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
      console.error("❌ requireAuth: Error conectando con Firebase:", fetchError.message);
      return res.status(500).json({ error: "No se pudo conectar con el servicio de autenticación." });
    }
    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data.users || data.users.length === 0) {
      return res.status(401).json({ error: "Token inválido o expirado." });
    }

    req.userId = data.users[0].localId;
    req.userEmail = (data.users[0].email || "").toLowerCase();
    next();
  } catch (error) {
    console.error("❌ requireAuth: Error inesperado:", error.message);
    res.status(500).json({ error: "Error validando sesión." });
  }
};
