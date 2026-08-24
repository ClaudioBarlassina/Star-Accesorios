import "dotenv/config";
import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    clave: {
      type: String,
      default: "principal",
      unique: true,
    },
    imagenes: [
      {
        url: {
          type: String,
          required: true,
        },
        cloudinary_id: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Carousel", carouselSchema, "carousels");
