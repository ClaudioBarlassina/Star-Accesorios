const {PRODUCTOS } = require("../db"); // "Users" debe ser el nombre de la tabla

const createProducts = async productsData => {
  const Newproducts = await PRODUCTOS.create(productsData);
  return Newproducts;
};

module.exports = createProducts;
