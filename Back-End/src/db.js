require("dotenv").config(); // llamo el paquete empleado para las variables
const { Sequelize } = require("sequelize");// llamo al ORM

const fs = require("fs"); //manejo de archivos
const path = require("path"); // manejo de rutas de archivos

//-------------------------------------------------------------------------------------------------------------------
//CONEXION CON LAS VARIABLES AL ARCHIVO .ENV

// Usa la variable DATABASE_URL proporcionada por Render
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  native: false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
      require:true // Esto es necesario para usar SSL en Render
    },
  },
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch(err => {
    console.error('Error de conexión', err);
  });

// ------------------------------------------------------------------------------------------------------------------/
//crea la tabla 
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });


modelDefiners.forEach(model => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

//-------------------------------------------------------------------------------------------------------------
// defino los modelos 
const { PRODUCTOS } = sequelize.models;                // en models esta el modelo que se va a crear en POSTGRES

//------------------------------------------------------------------------------------------------------------------

module.exports = {
    ...sequelize.models,
    conn:sequelize,
}
