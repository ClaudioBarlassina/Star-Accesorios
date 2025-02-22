const server = require("./src/server.js");

const { conn } = require("./src/db.js");
const PORT = 3001;

//-----------------------------------------------------------------------------------------------------

conn.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`); //` ` COMILLAS ALT+96
  });
});
