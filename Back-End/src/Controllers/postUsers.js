const { USUARIOS } = require("../db"); // "Users" debe ser el nombre de la tabla

const createUsers = async userData => {
  const NewUsers = await USUARIOS.create(userData);
  return NewUsers;
};

module.exports = createUsers;
