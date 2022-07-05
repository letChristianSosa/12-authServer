const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);

    console.log("DB Conectada");
  } catch (error) {
    console.log(error);
    throw new Error("Error conectando a la BD");
  }
};

module.exports = {
  dbConnection,
};
