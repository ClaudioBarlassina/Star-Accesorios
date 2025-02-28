const express = require("express");
const Products = require("./Products");

const app = express.Router();

app.use("/", Products);

module.exports = app;
