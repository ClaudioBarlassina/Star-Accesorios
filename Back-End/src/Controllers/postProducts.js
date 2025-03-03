const { PRODUCTOS } = require("../db"); // Asegúrate de que 'PRODUCTOS' es tu modelo

const createProducts = async (productsData, stock) => {
  try {
    // Crea un array con la cantidad de productos a insertar
    const productos = Array.from({ length: stock}, () => productsData);
    
    // Inserta los productos de una sola vez
    const newProducts = await PRODUCTOS.bulkCreate(productos);
    return newProducts;
  } catch (error) {
    console.error(error);
    throw new Error('Error al insertar productos');
  }
};

module.exports = createProducts;
