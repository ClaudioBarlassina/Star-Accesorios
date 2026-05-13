import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "32px",
            fontFamily: "var(--body)",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontFamily: "var(--heading)", fontSize: "24px", color: "var(--text)" }}>
            Algo salió mal
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Ocurrió un error inesperado. Por favor, recargá la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              background: "var(--dark)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--ui)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recargar página
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              marginTop: "12px",
              padding: "12px 24px",
              background: "transparent",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontFamily: "var(--ui)",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Volver al inicio
          </button>
        </div>
      )
    }

    return this.props.children
  }
}