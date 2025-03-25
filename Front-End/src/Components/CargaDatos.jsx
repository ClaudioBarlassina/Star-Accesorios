

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./CargaDatos.css";
import { useNavigate } from "react-router-dom";



const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [subCategoria, setSubCategoria] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
   
  const navigate = useNavigate();


  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Mostrar previsualización en tiempo real
    }
  };

  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
    setSubCategoria("");
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setCantidad(isNaN(value) || value <= 0 ? 1 : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "activa");

        const response = await fetch("https://api.cloudinary.com/v1_1/deo4yfqad/image/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Error al subir la imagen");

        imageUrl = data.secure_url;
      }

      const priceNumber = parseFloat(price);
      if (isNaN(priceNumber)) throw new Error("El precio debe ser un número válido.");

      // Insertar la cantidad de productos con el stock actualizado
      const productosAInsertar = {
        nombre: name,
        precio: priceNumber,
        Image: imageUrl,
        Categoria: categoria,
        SubCategoria: subCategoria,
        stock: cantidad, // Solo asignamos la cantidad ingresada al stock de un producto
      };

      // productosAInsertar

      const { error: insertError } = await supabase.from("Productos").insert(productosAInsertar);

      if (insertError) throw insertError;

      alert(`${cantidad} productos cargados exitosamente!`);
      setName("");
      setPrice("");
      setImage(null);
      setPreviewImage(null);
      setCategoria("");
      setSubCategoria("");
      setCantidad(1);
    } catch (error) {
      console.error("Error al subir productos:", error);
      alert("Hubo un error al subir los productos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="conteiner-cargadatos">
        <div>
        <button className="botton-listado" onClick={() => navigate("/Productos") }>Listado Productos </button>
        <button className="botton-listado">Listado de Pedidos </button>
        </div>
         
        <form className="Formulario" onSubmit={handleSubmit}>
          <h2>INGRESO DE PRODUCTOS</h2>
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
            <option value="Acero Quirurgico">Acero Quirurgico</option>
            <option value="Acero Blanco">Acero Blanco</option>
            <option value="Acero Dorado">Acero Dorado</option>
            <option value="Piedras Naturales">Piedras Naturales</option>
            <option value="Fantasía">Fantasía</option>
            <option value="Cosméticos">Cosméticos</option>
          </select>

          {categoria && (
            <select value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)} required>
              <option value="">Selecciona una subcategoría</option>
              <option value="Anillos">Anillos</option>
              <option value="Colgantes">Colgantes</option>
              <option value="Aros">Aros</option>
              <option value="Pulseras">Pulseras</option>
              <option value="Piercing">Piercing</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          )}

          <input type="file" onChange={handleImageChange} accept="image/*" required />

          <input
            type="number"
            // value={cantidad}
            onChange={handleCantidadChange}
            placeholder="Cantidad"
            min="1"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Subiendo..." : `Subir ${cantidad} Producto(s)`}
          </button>
        </form>

        {name && price && previewImage && categoria && subCategoria && cantidad > 0 && (
          <div className="Previsualizacion">
            <h3>Previsualización</h3>
            <img src={previewImage} alt="Previsualización" style={{ width: "150px", height: "150px" }} />
            <p><strong>Nombre:</strong> {name}</p>
            <p><strong>Precio:</strong> ${price}</p>
            <p><strong>Categoría:</strong> {categoria}</p>
            <p><strong>Subcategoría:</strong> {subCategoria}</p>
            <p><strong>Cantidad:</strong> {cantidad}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AddProduct;




























// import { useState } from "react";
// import { supabase } from "../supabaseClient"; // Asegúrate de importar Supabase correctamente
// import "./CargaDatos.css";

// const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/<TU_CLOUD_NAME>/image/upload"; // Reemplaza con tu Cloud Name

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [categoria, setCategoria] = useState("");
//   const [subCategoria, setSubCategoria] = useState("");
//   const [loading, setLoading] = useState(false);

//   const categorias = [
//     "Acero Quirurgico",
//     "Acero Blanco",
//     "Acero Dorado",
//     "Piedras Naturales",
//     "Fantasía",
//     "Cosméticos",
//   ];
  
//   const subCategorias = {
//     "Acero Quirurgico": ["Anillos", "Colgantes", "Aros", "Pulseras", "Piercing", "Accesorios"],
//     "Acero Blanco": ["Anillos", "Colgantes", "Aros", "Pulseras"],
//     "Acero Dorado": ["Anillos", "Colgantes", "Aros", "Pulseras"],
//     "Piedras Naturales": ["Dijes", "Kits"],
//     "Fantasía": ["Anillos", "Aros", "Accesorios Cabello", "Pulseras"],
//     "Cosméticos": ["Todos"]
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleCategoriaChange = (e) => {
//     setCategoria(e.target.value);
//     setSubCategoria("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = "";

//       if (image) {
//         const formData = new FormData();
//         formData.append("file", image);
//         formData.append("upload_preset", "activa"); // Reemplaza con tu preset de Cloudinary

//         const response = await fetch("https://api.cloudinary.com/v1_1/deo4yfqad/image/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error("Error al subir la imagen");

//         imageUrl = data.secure_url; // Obtener URL pública de Cloudinary
//       }

//       const priceNumber = parseFloat(price);
//       if (isNaN(priceNumber)) throw new Error("El precio debe ser un número válido.");

//       const { error: insertError } = await supabase.from("Productos").insert([
//         {
//           nombre: name,
//           precio: priceNumber,
//           Image: imageUrl,
//           Categoria: categoria,
//           SubCategoria: subCategoria,
//         },
//       ]);

//       if (insertError) throw insertError;

//       alert("Producto cargado exitosamente!");
//       setName("");
//       setPrice("");
//       setImage(null);
//       setCategoria("");
//       setSubCategoria("");
//     } catch (error) {
//       console.error("Error al subir producto:", error);
//       alert("Hubo un error al subir el producto.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="Formulario" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Nombre del producto"
//         required
//       />
//       <input
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//         placeholder="Precio"
//         required
//       />
      
//       <select value={categoria} onChange={handleCategoriaChange} required>
//         <option value="">Selecciona una categoría</option>
//         {categorias.map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>

//       {categoria && subCategorias[categoria] && (
//         <select value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)} required>
//           <option value="">Selecciona una subcategoría</option>
//           {subCategorias[categoria].map((sub) => (
//             <option key={sub} value={sub}>
//               {sub}
//             </option>
//           ))}
//         </select>
//       )}

//       <input type="file" onChange={handleImageChange} accept="image/*" required />
//       <button type="submit" disabled={loading}>
//         {loading ? "Subiendo..." : "Subir Producto"}
//       </button>
//     </form>
//   );
// };

// export default AddProduct;


//-----------------------------------------------------------------------------------------------------




// import { useState } from "react";
// import { supabase } from "../supabaseClient"; // Asegúrate de importar Supabase correctamente
// import "./CargaDatos.css";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState(null);
//   const [categoria, setCategoria] = useState("");
//   const [subCategoria, setSubCategoria] = useState("");
//   const [cantidad, setCantidad] = useState(1); // Número de productos a subir
//   const [loading, setLoading] = useState(false);

//   const categorias = [
//     "Acero Quirurgico",
//     "Acero Blanco",
//     "Acero Dorado",
//     "Piedras Naturales",
//     "Fantasía",
//     "Cosméticos",
//   ];
  
//   const subCategorias = {
//     "Acero Quirurgico": ["Anillos", "Colgantes", "Aros", "Pulseras", "Piercing", "Accesorios"],
//     "Acero Blanco": ["Anillos", "Colgantes", "Aros", "Pulseras"],
//     "Acero Dorado": ["Anillos", "Colgantes", "Aros", "Pulseras"],
//     "Piedras Naturales": ["Dijes", "Kits"],
//     "Fantasía": ["Anillos", "Aros", "Accesorios Cabello", "Pulseras"],
//     "Cosméticos": ["Todos"]
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleCategoriaChange = (e) => {
//     setCategoria(e.target.value);
//     setSubCategoria("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = "";

//       if (image) {
//         const formData = new FormData();
//         formData.append("file", image);
//         formData.append("upload_preset", "activa"); // Reemplaza con tu preset de Cloudinary

//         const response = await fetch("https://api.cloudinary.com/v1_1/deo4yfqad/image/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();
//         if (!response.ok) throw new Error("Error al subir la imagen");

//         imageUrl = data.secure_url; // Obtener URL pública de Cloudinary
//       }

//       const priceNumber = parseFloat(price);
//       if (isNaN(priceNumber)) throw new Error("El precio debe ser un número válido.");

//       const productosAInsertar = Array.from({ length: cantidad }, () => ({
//         nombre: name,
//         precio: priceNumber,
//         Image: imageUrl,
//         Categoria: categoria,
//         SubCategoria: subCategoria,
//       }));

//       const { error: insertError } = await supabase.from("Productos").insert(productosAInsertar);

//       if (insertError) throw insertError;

//       alert(`${cantidad} productos cargados exitosamente!`);
//       setName("");
//       setPrice("");
//       setImage(null);
//       setCategoria("");
//       setSubCategoria("");
//       setCantidad(1);
//     } catch (error) {
//       console.error("Error al subir productos:", error);
//       alert("Hubo un error al subir los productos.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="Formulario" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Nombre del producto"
//         required
//       />
//       <input
//         type="number"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//         placeholder="Precio"
//         required
//       />
      
//       <select value={categoria} onChange={handleCategoriaChange} required>
//         <option value="">Selecciona una categoría</option>
//         {categorias.map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>

//       {categoria && subCategorias[categoria] && (
//         <select value={subCategoria} onChange={(e) => setSubCategoria(e.target.value)} required>
//           <option value="">Selecciona una subcategoría</option>
//           {subCategorias[categoria].map((sub) => (
//             <option key={sub} value={sub}>
//               {sub}
//             </option>
//           ))}
//         </select>
//       )}

//       <input type="file" onChange={handleImageChange} accept="image/*" required />

//       {/* Campo para definir la cantidad de productos a subir */}
//       <input
//         type="number"
//         value={cantidad}
//         onChange={(e) => setCantidad(parseInt(e.target.value, 10))}
//         placeholder="Cantidad"
//         min="1"
//         required
//       />

//       <button type="submit" disabled={loading}>
//         {loading ? "Subiendo..." : `Subir ${cantidad} Producto(s)`}
//       </button>
//     </form>
//   );
// };

// export default AddProduct;