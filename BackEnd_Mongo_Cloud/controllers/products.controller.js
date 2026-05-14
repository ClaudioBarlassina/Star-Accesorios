import * as service from "../services/products.service.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";


export const getProducts = async (req, res) => {
  try {
    const products = await service.getAllProducts(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: "Producto no encontrado" });
  }
};

export const addProduct = async (req, res) => {
  console.log("BODY:", req.body);
   try {
   let images = [];
  console.log("FILES", req.files)
if (req.files && req.files.length > 0) {
  console.log("📸 Imágenes recibidas:", req.files.length);

  const uploads = await Promise.all(
    req.files.map(file => uploadImage(file.buffer))
  );

  images = uploads.map(result => ({
    url: result.secure_url,
    cloudinary_id: result.public_id,
  }));

  console.log("☁️ Subidas a Cloudinary:", images.length);

    }

   const newProduct = await service.createProduct({
  ...req.body,
  images,
});

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ Error creando producto:", error.message); // 👈 DEBUG
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await service.getProductById(req.params.id);

    let imageData = {};

    if (req.file) {
      // borrar imagen vieja
      if (product.cloudinary_id) {
        await deleteImage(product.cloudinary_id);
      }

      // subir nueva
      const result = await uploadImage(req.file.buffer);

      imageData = {
        image: result.secure_url,
        cloudinary_id: result.public_id,
      };
    }

    const updatedProduct = await service.updateProduct(
      req.params.id,
      {
        ...req.body,
        ...imageData,
      }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
   try {
    const product = await service.getProductById(req.params.id);

    if (product.cloudinary_id) {
      await deleteImage(product.cloudinary_id);
    }

    await service.deleteProduct(req.params.id);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};