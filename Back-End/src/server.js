// /---------------------------------------------------------------------/
const express = require("express");
const router = require("./routers"); // rutas
const morgan = require("morgan");
const cors = require("cors");

//-------------------------------------------------------------------------

const server = express();
server.use(express.json());

server.use(morgan("dev"));
server.use(cors());

//-------------------------------------------------------------------------
server.use(router);
// server.use(router)  //implementa las rutas

//--------------------------------------------------------------------------

module.exports = server;
