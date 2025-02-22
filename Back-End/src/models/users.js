const { DataTypes } = require("sequelize");

module.exports = sequelize => {
  sequelize.define("USUARIOS", {
    Nombre: {
      type: DataTypes.STRING,
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
