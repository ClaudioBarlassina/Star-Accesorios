import * as service from "../services/products.service.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";

// las variantes llegan como JSON en el body; cada una puede referenciar su
// imagen por url ya existente o por fileIndex (posición entre los archivos
// subidos en este request)
const resolverVariantes = (raw, uploadedImages = []) => {
  if (!raw) return [];

  let list = raw;
  if (typeof raw === "string") {
    try {
      list = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(list)) return [];

  return list
    .filter((v) => v && typeof v.nombre === "string" && v.nombre.trim())
    .map((v) => {
      const variante = { nombre: v.nombre.trim() };
      if (typeof v.imageUrl === "string" && v.imageUrl) {
        variante.imageUrl = v.imageUrl;
      } else if (
        Number.isInteger(v.fileIndex) &&
        uploadedImages[v.fileIndex]?.url
      ) {
        variante.imageUrl = uploadedImages[v.fileIndex].url;
      }
      return variante;
    });
};

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
  variantes: resolverVariantes(req.body.variantes, images),
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

    // ids de Cloudinary que se conservan (pueden llegar como string o array)
    const rawKeep = req.body.keepImageIds;
    const keepIds = rawKeep
      ? (Array.isArray(rawKeep) ? rawKeep : [rawKeep]).filter(Boolean)
      : [];

    // borrar de Cloudinary las imágenes que se quitaron
    const toRemove = (product.images || []).filter(
      (img) => !keepIds.includes(img.cloudinary_id)
    );

    await Promise.all(
      toRemove.map((img) => deleteImage(img.cloudinary_id))
    );

    // subir las imágenes nuevas
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map((file) => uploadImage(file.buffer))
      );

      newImages = uploads.map((result) => ({
        url: result.secure_url,
        cloudinary_id: result.public_id,
      }));
    }

    // conservadas + nuevas
    const images = [
      ...(product.images || []).filter((img) => keepIds.includes(img.cloudinary_id)),
      ...newImages,
    ];

    const { keepImageIds, ...rest } = req.body;

    const datosUpdate = { ...rest, images };
    if (req.body.variantes !== undefined) {
      // las variantes se reemplazan por completo en cada edición
      datosUpdate.variantes = resolverVariantes(req.body.variantes, newImages);
    }

    const updatedProduct = await service.updateProduct(
      req.params.id,
      datosUpdate
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error actualizando producto:", error.message);
    res.status(404).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let product;
    try {
      product = await service.getProductById(req.params.id);
    } catch {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // borrar todas las imágenes de Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        await Promise.all(
          product.images.map((img) => deleteImage(img.cloudinary_id))
        );
      } catch (cloudErr) {
        console.error("⚠️ Error borrando imágenes de Cloudinary (se continúa con la eliminación):", cloudErr.message);
      }
    }

    await service.deleteProduct(req.params.id);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("❌ Error eliminando producto:", error.message);
    res.status(500).json({ error: "Error al eliminar el producto." });
  }
};

export const bulkCreateProducts = async (req, res) => {
  try {
    const productos = JSON.parse(req.body.productos || "[]");
    const imagesMap = JSON.parse(req.body.imagesMap || "{}");
    const files = req.files || [];

    if (!productos.length) {
      return res.status(400).json({ error: "No se enviaron productos" });
    }

    // subir imágenes a Cloudinary en batches de 5
    let uploads = [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 5) {
        const batch = files.slice(i, i + 5);
        const results = await Promise.all(
          batch.map((file) => uploadImage(file.buffer))
        );
        uploads.push(...results);
      }
    }

    // asignar imágenes a cada producto según el map
    const productosConImagenes = productos.map((prod, i) => {
      const indices = imagesMap[i] || [];
      const images = indices
        .filter((idx) => uploads[idx])
        .map((idx) => ({
          url: uploads[idx].secure_url,
          cloudinary_id: uploads[idx].public_id,
        }));
      return { ...prod, images, stock: prod.stock ?? 1 };
    });

    let created = [];
    let failed = 0;
    try {
      created = await service.bulkCreateProducts(productosConImagenes);
    } catch (err) {
      // insertMany con ordered:false guarda los exitosos
      created = err.insertedDocs || [];
      failed = (err.writeErrors || []).length;
      console.error(`⚠️ Bulk: ${created.length} creados, ${failed} fallidos`);
    }

    res.status(201).json({
      message: `${created.length} producto(s) creado(s)${failed > 0 ? `, ${failed} fallido(s)` : ""}`,
      created: created.length,
      failed,
      products: created,
    });
  } catch (error) {
    console.error("❌ Error en bulk create:", error.message);
    res.status(500).json({ error: "Error al crear productos en lote." });
  }
};