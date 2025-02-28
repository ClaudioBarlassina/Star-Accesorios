const {PRODUCTOS} = require("../db"); // "Users" debe ser el nombre de la tabla

const getAllproducts = async () => {
  const AllProducts = await PRODUCTOS.findAll();
  return AllProducts;
};

module.exports = getAllproducts;
