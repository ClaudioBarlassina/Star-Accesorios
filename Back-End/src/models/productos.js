const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("PRODUCTOS", {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Categoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SubCategoria: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
// module.exports = sequelize => {
//     sequelize.define("Nombre_del_modelo", {
//         ID: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             primaryKey:true,
//         }
//     })
// }
