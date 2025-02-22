
const { USUARIOS } = require("../db")

const DeleteUsers = async (userID) => {
    const user = await USUARIOS.findByPk(userID);

    if (!user) {
        throw new Error("Usuario no Encontrado")
    }

    const userToDelete = {
        id: user.id,
        nombre: user.Nombre,
       
    }
   
    user.destroy(user)
    return {
        user:userToDelete, message:"El usuario ha sido eliminado"
    }

}


module.exports = DeleteUsers;