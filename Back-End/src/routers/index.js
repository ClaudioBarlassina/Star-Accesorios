const express = require("express");
const Users = require("./Users");

const app = express.Router();

app.use("/", Users);

module.exports = app;
