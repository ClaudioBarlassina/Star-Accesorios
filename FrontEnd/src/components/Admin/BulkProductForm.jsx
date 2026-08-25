import { useState, useRef } from "react"
import { bulkCreateProducts } from "../../api/products.api"
import { CATEGORIAS, getSubcategoriasDe } from "../../config/categories"
import styles from "../Admin/AdminDashboard.module.css"

const emptyRow = () => ({
  nombre: "",
  precio: "",
  stock: 1,
  categoria: "",
  subcategoria: "",
  descripcion: "",
  variantesText: "",
  files: [],
  previews: [],
})

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) throw new Error("El CSV necesita header + al menos 1 fila de datos")

  const sep = lines[0].includes(";") ? ";" : ","
  const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase().replace(/["']/g, ""))

  const idx = {
    nombre: headers.indexOf("nombre"),
    precio: headers.indexOf("precio"),
    stock: headers.indexOf("stock"),
    categoria: headers.indexOf("categoria"),
    subcategoria: headers.indexOf("subcategoria"),
    descripcion: headers.indexOf("descripcion"),
    variantes: headers.indexOf("variantes"),
  }

  if (idx.nombre === -1 || idx.precio === -1) {
    throw new Error("Faltan columnas obligatorias: nombre y precio")
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ""))
    return {
      nombre: idx.nombre >= 0 ? cols[idx.nombre] || "" : "",
      precio: idx.precio >= 0 ? cols[idx.precio] || "" : "",
      stock: idx.stock >= 0 ? cols[idx.stock] || "1" : "1",
      categoria: idx.categoria >= 0 ? cols[idx.categoria] || "" : "",
      subcategoria: idx.subcategoria >= 0 ? cols[idx.subcategoria] || "" : "",
      descripcion: idx.descripcion >= 0 ? cols[idx.descripcion] || "" : "",
      variantesText: idx.variantes >= 0 ? cols[idx.variantes] || "" : "",
      files: [],
      previews: [],
    }
  })
}

const inputStyle = { width: "100%", padding: "8px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", fontFamily: "var(--body)", fontSize: "13px", outline: "none", boxSizing: "border-box" }
const selectStyle = { ...inputStyle, background: "white" }
const btnStyle = { padding: "6px 12px", border: "none", borderRadius: "var(--radius-sm)", fontFamily: "var(--ui)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }

export default function BulkProductForm({ onSave, onClose }) {
  const [phase, setPhase] = useState("upload")
  const [rows, setRows] = useState([])
  const [csvError, setCsvError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})
  const inputRef = useRef()

  const handleFile = (file) => {
    setCsvError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = parseCsv(e.target.result)
        if (parsed.length === 0) {
          setCsvError("El CSV no contiene datos")
          return
        }
        setRows(parsed)
        setPhase("edit")
      } catch (err) {
        setCsvError(err.message)
      }
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
    e.target.value = ""
  }

  const updateRow = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => {
      if (idx !== i) return r
      const next = { ...r, [field]: value }
      if (field === "categoria") next.subcategoria = ""
      return next
    }))
  }

  const addFiles = (i, e) => {
    const files = Array.from(e.target.files || [])
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setRows((prev) => prev.map((r, idx) => {
      if (idx !== i) return r
      return { ...r, files: [...r.files, ...files], previews: [...r.previews, ...newPreviews] }
    }))
    e.target.value = ""
  }

  const removeFile = (rowIdx, fileIdx) => {
    setRows((prev) => prev.map((r, idx) => {
      if (idx !== rowIdx) return r
      URL.revokeObjectURL(r.previews[fileIdx])
      return {
        ...r,
        files: r.files.filter((_, fi) => fi !== fileIdx),
        previews: r.previews.filter((_, fi) => fi !== fileIdx),
      }
    }))
  }

  const addRow = () => setRows((prev) => [...prev, emptyRow()])

  const removeRow = (i) => {
    if (rows.length <= 1) return
    rows[i].previews.forEach((u) => URL.revokeObjectURL(u))
    setRows((prev) => prev.filter((_, idx) => idx !== i))
  }

  const validate = () => {
    const errs = {}
    rows.forEach((r, i) => {
      const rowErrors = {}
      if (!r.nombre.trim()) rowErrors.nombre = true
      if (!r.precio || Number(r.precio) <= 0) rowErrors.precio = true
      if (Object.keys(rowErrors).length > 0) errs[i] = rowErrors
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const fd = new FormData()

      const productos = rows.map(({ files: _f, previews: _p, variantesText, ...rest }) => ({
        ...rest,
        precio: Number(rest.precio),
        stock: Number(rest.stock) || 1,
        variantes: (variantesText || "")
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((nombre) => ({ nombre })),
      }))
      fd.append("productos", JSON.stringify(productos))

      const mapForSubmit = {}
      let globalIdx = 0
      rows.forEach((r, i) => {
        const indices = []
        r.files.forEach(() => { indices.push(globalIdx); globalIdx++ })
        mapForSubmit[i] = indices
      })
      fd.append("imagesMap", JSON.stringify(mapForSubmit))

      rows.forEach((r) => { r.files.forEach((f) => fd.append("images", f)) })

      const res = await bulkCreateProducts(fd)
      setResult(res.data)
    } catch (err) {
      setResult({
        message: err.response?.data?.error || "Error al crear productos",
        created: 0,
        failed: rows.length,
      })
    } finally {
      setSaving(false)
    }
  }

  if (result) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
        <div style={{ background: "white", borderRadius: "var(--radius-md)", padding: "32px", maxWidth: "420px", width: "90%", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>{result.created > 0 ? "✅" : "❌"}</div>
          <h3 style={{ fontFamily: "var(--heading)", margin: "0 0 8px" }}>{result.message}</h3>
          {result.created > 0 && <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{result.created} producto(s) creado(s) exitosamente</p>}
          {result.failed > 0 && <p style={{ color: "#dc2626", fontSize: "14px" }}>{result.failed} producto(s) fallaron</p>}
          <button onClick={() => { setResult(null); onSave() }} style={{ ...btnStyle, background: "var(--gold)", color: "white", padding: "10px 24px", fontSize: "14px", marginTop: "16px" }}>Cerrar</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, overflowY: "auto" }}>
      <div style={{ background: "white", borderRadius: "var(--radius-md)", padding: "24px", maxWidth: "960px", width: "95%", margin: "40px auto", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontFamily: "var(--heading)", fontSize: "20px", margin: 0 }}>Carga múltiple de productos</h2>
          <button onClick={onClose} style={{ ...btnStyle, background: "transparent", fontSize: "18px" }}>✕</button>
        </div>

        {phase === "upload" && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "var(--gold)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "48px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "var(--gold-bg)" : "var(--surface)",
                transition: "all 200ms ease",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
              <p style={{ fontFamily: "var(--heading)", fontSize: "16px", margin: "0 0 8px", color: "var(--text)" }}>
                Arrastrá tu archivo CSV aquí
              </p>
              <p style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                o hacé click para seleccionar
              </p>
              <input ref={inputRef} type="file" accept=".csv,.txt" style={{ display: "none" }} onChange={handleInputChange} />
            </div>

            {csvError && (
              <div style={{ marginTop: "12px", padding: "10px 14px", background: "#fee2e2", borderRadius: "var(--radius-sm)", color: "#dc2626", fontFamily: "var(--ui)", fontSize: "13px" }}>
                {csvError}
              </div>
            )}

            <div style={{ marginTop: "20px", padding: "16px", background: "var(--surface)", borderRadius: "var(--radius-sm)" }}>
              <p style={{ fontFamily: "var(--ui)", fontSize: "13px", fontWeight: 600, margin: "0 0 8px" }}>Formato esperado del CSV:</p>
              <pre style={{ fontFamily: "monospace", fontSize: "12px", margin: 0, overflow: "auto", color: "var(--text-secondary)" }}>{`nombre,precio,stock,categoria,subcategoria,descripcion,variantes
Aro Luna Plata,1500,10,Acero Quirurgico,Aros,Aro con forma de luna,10 mm|12 mm|15 mm
Pulsera Cadena,2500,5,Acero Dorado,Pulseras,Pulsera eslabones,
Collar Perlas,3200,,Fantasia,Colgantes,Collar color perla,Chico|Grande`}</pre>
              <p style={{ fontFamily: "var(--ui)", fontSize: "12px", color: "var(--text-secondary)", margin: "8px 0 0" }}>
                <strong>Obligatorias:</strong> nombre, precio &nbsp;|&nbsp;
                <strong>Opcionales:</strong> stock (default 1), categoria, subcategoria, descripcion, variantes (separadas por |)<br />
                Separador: coma o punto y coma. Se soportan comillas.
              </p>
            </div>
          </div>
        )}

        {phase === "edit" && (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "var(--surface)", textAlign: "left" }}>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "140px" }}>Nombre *</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "80px" }}>Precio *</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "60px" }}>Stock</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "120px" }}>Categoría</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "120px" }}>Subcat.</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "120px" }}>Variantes</th>
                    <th style={{ padding: "8px", fontWeight: 600, fontFamily: "var(--ui)", minWidth: "130px" }}>Imágenes</th>
                    <th style={{ padding: "8px", minWidth: "36px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "6px" }}>
                        <input style={{ ...inputStyle, borderColor: errors[i]?.nombre ? "#dc2626" : undefined }} value={row.nombre} onChange={(e) => updateRow(i, "nombre", e.target.value)} placeholder="Nombre" />
                      </td>
                      <td style={{ padding: "6px" }}>
                        <input style={{ ...inputStyle, borderColor: errors[i]?.precio ? "#dc2626" : undefined }} type="number" min="0" step="0.01" value={row.precio} onChange={(e) => updateRow(i, "precio", e.target.value)} placeholder="$" />
                      </td>
                      <td style={{ padding: "6px" }}>
                        <input style={inputStyle} type="number" min="0" value={row.stock} onChange={(e) => updateRow(i, "stock", e.target.value)} />
                      </td>
                      <td style={{ padding: "6px" }}>
                        <select style={selectStyle} value={row.categoria} onChange={(e) => updateRow(i, "categoria", e.target.value)}>
                          <option value="">-</option>
                          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "6px" }}>
                        <select style={selectStyle} value={row.subcategoria} onChange={(e) => updateRow(i, "subcategoria", e.target.value)} disabled={!row.categoria}>
                          <option value="">-</option>
                          {getSubcategoriasDe(row.categoria).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "6px" }}>
                        <input style={inputStyle} value={row.variantesText} onChange={(e) => updateRow(i, "variantesText", e.target.value)} placeholder="10 mm|12 mm" title="Variantes separadas por |" />
                      </td>
                      <td style={{ padding: "6px" }}>
                        <div style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
                          {row.previews.map((url, fi) => (
                            <div key={fi} style={{ position: "relative", width: "36px", height: "36px" }}>
                              <img src={url} alt="" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "4px" }} />
                              <button onClick={() => removeFile(i, fi)} style={{ position: "absolute", top: "-4px", right: "-4px", width: "14px", height: "14px", borderRadius: "50%", background: "#dc2626", color: "white", border: "none", fontSize: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                            </div>
                          ))}
                          <label style={{ ...btnStyle, background: "var(--border-light)", color: "var(--text)", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" }}>
                            + Fotos
                            <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => addFiles(i, e)} />
                          </label>
                        </div>
                      </td>
                      <td style={{ padding: "6px", textAlign: "center" }}>
                        {rows.length > 1 && (
                          <button onClick={() => removeRow(i)} style={{ ...btnStyle, background: "#fee2e2", color: "#dc2626", fontSize: "14px" }}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={addRow} style={{ ...btnStyle, background: "var(--border-light)", color: "var(--text)" }}>
                  + Agregar fila
                </button>
                <button onClick={() => { setPhase("upload"); setRows([]); setErrors({}) }} style={{ ...btnStyle, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  ← Otro CSV
                </button>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
                  {rows.length} producto{rows.length !== 1 ? "s" : ""}
                </span>
                <button onClick={onClose} style={{ ...btnStyle, background: "var(--border-light)", color: "var(--text)" }}>Cancelar</button>
                <button onClick={handleSubmit} disabled={saving} style={{ ...btnStyle, background: "var(--gold)", color: "white", padding: "10px 20px", fontSize: "13px", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Creando..." : `Crear ${rows.length} producto${rows.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
