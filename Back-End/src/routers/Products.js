const { Router } = require("express");

const updateUsers = require("../Controllers/updateUser");
const SearchUser = require("../Controllers/SearchUser");
const DeleteUsers = require("../Controllers/DeleteUsers");
const getAllproducts = require("../Controllers/getAllproducts");
const createProducts = require("../Controllers/postProducts");

const router = Router();

//---------------------------------------------------------------------
//---Lee los Usuarios----------
router.get("/", async (req, res) => {
  const products = await getAllproducts();
  res.status(200).json(products);
  // res.send("users")
});

//----------------------------------------------------------------------
//-------Ingresa los usuarios------------------
router.post("/products", async (req, res) => {
  // try {
  const{productdata, stock} = req.body; // en el caso de postgres local poner req.body[0]
  console.log(productdata);
  const newProduct = await createProducts(productdata, stock);
  res.status(200).json(newProduct);
  // } catch (error) {
  //   res.send(error.detail);
  // }
});
router.get("/paises", async (req, res) => {
  // const users = await getAllUsers();
  //    res.status(200).json(users)
  res.send("paises");
});

//-------------------------------------------------------------------------------
//---Actualiza los usuarios pidiendo por ID
router.put("/users/:usersID", async (req, res) => {
  const usersID = req.params.usersID;
  const userData = req.body;
  const updateUser = await updateUsers(userData, usersID);

  console.log();
  res.status(200).json(updateUser);
});

//--------------------------------------------------------------------------------
//Busqueda por ID
router.get("/users/:usersID", async (req, res) => {
  const userID = req.params.usersID;
  const search = await SearchUser(userID);

  res.status(200).json(search);
});

//----------------------------------------------------------------------------------
// Eliminar un registro

router.delete("/users/:userID", async (req, res) => {
  const userID = req.params.userID;

  const user = await DeleteUsers(userID);
  res.status(200).json(user);
});

module.exports = router;
