import { useState } from "react"
import useAuthActions from "../../hooks/useAuthActions"
import styles from "./AuthModal.module.css"

export default function AuthComponent() {
  const { login, register, loginGoogle } = useAuthActions()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [nombre, setNombre] = useState("")

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, nombre)
      }
      setError("")
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Usuario o contraseña incorrecta")
      } else if (err.code === "auth/email-already-in-use") {
        setError("El email ya está registrado")
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres")
      } else {
        setError("Error al autenticar")
      }
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>

        {!isLogin && (
          <input
            className={styles.input}
            placeholder="Nombre"
            onChange={(e) => setNombre(e.target.value)}
          />
        )}
        <input
          className={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          {isLogin ? "Entrar" : "Registrarse"}
        </button>

        <div className={styles.divider}>o</div>

        <button className={styles.googleButton} onClick={async () => {
          try {
            await loginGoogle()
            setError("")
          } catch (err) {
            if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
              setError("El popup fue bloqueado o cerrado. Permití popups para este sitio.")
            } else if (err.code === "auth/unauthorized-domain") {
              setError("Este dominio no está autorizado. Agregalo en Firebase Console > Authentication > Settings > Authorized domains.")
            } else if (err.code === "auth/operation-not-allowed") {
              setError("El inicio de sesión con Google no está habilitado. Activá Google en Firebase Console > Authentication > Sign-in method.")
            } else {
              setError(err.code ? `Error: ${err.code}` : "Error al iniciar sesión con Google")
            }
          }
        }}>
          Ingresar con Google
        </button>

        {error && <p className={styles.error}>{error}</p>}

        <p
          className={styles.switch}
          onClick={() => {
            setIsLogin(!isLogin)
            setError("")
          }}
        >
          {isLogin ? "Crear cuenta" : "Ya tengo cuenta"}
        </p>
      </div>
    </div>
  )
}