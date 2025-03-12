import { useState } from "react";
import { supabase } from "../supabaseClient"; // Asegúrate de importar Supabase correctamente
import "./CargaDatos.css";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/<TU_CLOUD_NAME>/image/upload"; // Reemplaza con tu Cloud Name

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [subCategoria, setSubCategoria] = useState("");
  const [loading, setLoading] = useState(false);

  const categorias = [
    "Acero Quirurgico",
    "Acero Blanco",
    "Acero Dorado",
    "Piedras Naturales",
    "Fantasía",
    "Cosméticos",
  ];
  
  const subCategorias = {
    "Acero Quirurgico": ["Anillos", "Colgantes", "Aros", "Pulseras", "Piercing", "Accesorios"],
    "Acero Blanco": ["Anillos", "Colgantes", "Aros", "Pulseras"],
    "Acero Dorado": ["Anillos", "Colgantes", "Aros", "Pulseras"],
    "Piedras Naturales": ["Dijes", "Kits"],
    "Fantasía": ["Anillos", "Aros", "Accesorios Cabello", "Pulseras"],
    "Cosméticos": ["Todos"]
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
    setSubCategoria("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "activa"); // Reemplaza con tu preset de Cloudinary

        const response = await fetch("https://api.cloudinary.com/v1_1/deo4yfqad/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Error al subir la imagen");

        imageUrl = data.secure_url; // Obtener URL pública de Cloudinary
      }

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) throw new Error("El precio debe ser un número válido.");

      const { error: insertError } = await supabase.from("Productos").insert([
        {
          nombre: name,
          precio: priceNumber,
          Image: imageUrl,
          Categoria: categoria,
          SubCategoria: subCategoria,
        },
      ]);

      if (insertError) throw insertError;

      alert("Producto cargado exitosamente!");
      setName("");
      setPrice("");
      setImage(null);
      setCategoria("");
      setSubCategoria("");
    } catch (error) {
      console.error("Error al subir producto:", error);
      alert("Hubo un error al subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="Formulario" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del producto"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        required
      />
      
      <select value={categoria} onChange={handleCategoriaChange} required>
        <option value="">Selecciona una categoría</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {categoria && subCategorias[categoria] && (
        <select value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)} required>
          <option value="">Selecciona una subcategoría</option>
          {subCategorias[categoria].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      <input type="file" onChange={handleImageChange} accept="image/*" required />
      <button type="submit" disabled={loading}>
        {loading ? "Subiendo..." : "Subir Producto"}
      </button>
    </form>
  );
};

export default AddProduct;
