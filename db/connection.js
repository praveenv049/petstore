const Sequelize = require("sequelize");
const sequelize = new Sequelize("petstore", "root", "password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect: ", error);
  });

module.exports = sequelize;
