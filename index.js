const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

const Router = require("./routes/auth.js");

// Crear el servidor/App de express;
const app = express();

// Base de datos
dbConnection();

// Directorio publico (Al entrar a la ruta localhost:PORT desde el navegador, muestra el index de public)
app.use(express.static("public"));

// Cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Asignas rutas /auth
app.use("/api/auth", Router);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
