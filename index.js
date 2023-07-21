const port = 1024;
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require("body-parser");
const sequelize = require("./db/connection");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`BaseUrl: http://localhost:${port}`);
});

require("./routes/pet.urls")(app);
require("./routes/user.urls")(app);
require("./routes/store.urls")(app);

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully.");
  })
  .catch((error) => {
    console.error("Unable to create table: ", error);
  });
