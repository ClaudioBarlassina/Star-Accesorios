import Carousel from "../models/carousel.model.js";

const CLAVE = "principal";

export const getCarousel = async () => {
  let doc = await Carousel.findOne({ clave: CLAVE });

  if (!doc) {
    doc = await Carousel.create({ clave: CLAVE, imagenes: [] });
  }

  return doc;
};

export const addImages = async (imagenes) => {
  const doc = await getCarousel();
  doc.imagenes.push(...imagenes);
  await doc.save();
  return doc;
};

export const removeImage = async (cloudinary_id) => {
  const doc = await getCarousel();
  const existe = doc.imagenes.some((img) => img.cloudinary_id === cloudinary_id);

  if (!existe) {
    throw new Error("Imagen no encontrada en el carrusel");
  }

  doc.imagenes = doc.imagenes.filter((img) => img.cloudinary_id !== cloudinary_id);
  await doc.save();
  return doc;
};
