import Product from "../models/product.model.js";


export const getAllProducts = async (query) => {
  const filter = {};

  if (query.category) {
    filter.categoria = query.category;
  }

  if (query.subcategory) {
    filter.subcategoria = query.subcategory;
  }

  if (query.search) {
    filter.nombre = { $regex: query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }

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


// 🔥 CORREGIDO
export const createProduct = async (data) => {
  return await Product.create(data);
};


export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    data,
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