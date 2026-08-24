import { createClient } from "./client";

const api = createClient("/api/carousel");

export const getCarousel = () => {
  return api.get("/");
};

export const uploadCarouselImages = (formData) => {
  return api.post("/", formData, { timeout: 120000 });
};

export const deleteCarouselImage = (cloudinaryId) => {
  return api.delete("/", { data: { cloudinary_id: cloudinaryId } });
};
