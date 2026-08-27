import Product from "../models/product.model.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";

export const getAllProducts = async (query) => {
  const filter = {};
  console.log(query)

  if (query.category) {
    filter.categoria = query.category;
  }

  if (query.subcategory) {
    filter.subcategoria = query.subcategory;
  }

  if (query.brand) {
    filter.brand = query.brand;
  }

  if (query.search) {
    filter.nombre = { $regex: query.search, $options: "i" };
  }

  // 🔥 FIX IMPORTANTE
  if (query.minPrice || query.maxPrice) {
    filter.precio = {}; // 👈 antes era price ❌

    if (query.minPrice) {
      filter.precio.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filter.precio.$lte = Number(query.maxPrice);
    }
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  };
};


export const getProductById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product;
};


// si el producto tiene variantes, el stock general pasa a ser la suma de sus stocks
const syncStock = (data) => {
  const tieneVariantes = Array.isArray(data.variantes) && data.variantes.length > 0;
  if (tieneVariantes) {
    const suma = data.variantes.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);
    return { ...data, stock: suma };
  }
  return data;
};

// 🔥 CORREGIDO
export const createProduct = async (data) => {
  return await Product.create(syncStock({ ...data, stock: data.stock ?? 1 }));
};


export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    syncStock(data),
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product;
};


export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  return product;
};

export const bulkCreateProducts = async (productos) => {
  return await Product.insertMany(productos.map(syncStock), { ordered: false });
};