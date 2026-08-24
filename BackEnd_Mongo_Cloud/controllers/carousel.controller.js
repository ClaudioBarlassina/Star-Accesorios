import * as service from "../services/carousel.service.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";

export const getCarousel = async (req, res) => {
  try {
    const carousel = await service.getCarousel();
    res.json(carousel.imagenes);
  } catch (error) {
    console.error("❌ Error obteniendo carrusel:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const addCarouselImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se enviaron imágenes" });
    }

    const uploads = await Promise.all(
      req.files.map((file) => uploadImage(file.buffer, "carousel"))
    );

    const imagenes = uploads.map((result) => ({
      url: result.secure_url,
      cloudinary_id: result.public_id,
    }));

    const carousel = await service.addImages(imagenes);

    res.status(201).json(carousel.imagenes);
  } catch (error) {
    console.error("❌ Error subiendo imágenes del carrusel:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const removeCarouselImage = async (req, res) => {
  try {
    const { cloudinary_id } = req.body;

    if (!cloudinary_id) {
      return res.status(400).json({ error: "Falta cloudinary_id" });
    }

    await service.removeImage(cloudinary_id);
    await deleteImage(cloudinary_id);

    res.json({ message: "Imagen eliminada" });
  } catch (error) {
    console.error("❌ Error eliminando imagen del carrusel:", error.message);
    res.status(error.message.includes("no encontrada") ? 404 : 500).json({ error: error.message });
  }
};
