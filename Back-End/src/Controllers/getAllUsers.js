const { USUARIOS } = require("../db"); // "Users" debe ser el nombre de la tabla

const getAllUsers = async () => {
  const Allusers = await USUARIOS.findAll();
  return Allusers;
};

module.exports = getAllUsers;
