const { USUARIOS } = require("../db")

const updateUsers = async (userData, usersID) => {
    
    const users = await USUARIOS.findByPk(usersID);
    await users.update(userData)
    return users
  
}

module.exports = updateUsers;