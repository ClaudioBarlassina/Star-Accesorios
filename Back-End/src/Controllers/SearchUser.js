const { USUARIOS } = require("../db")

const SearchUser = async (userId) => {
    const search = await USUARIOS.findByPk(userId)
    return search;
}

module.exports = SearchUser;