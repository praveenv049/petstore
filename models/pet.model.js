const DataTypes = require("sequelize");
const sequelize = require("../db/connection");

const Pet = sequelize.define("pets", {
  category: {
    type: DataTypes.INTEGER,
    references: {
      model: "categories",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  photoURL: {
    type: DataTypes.STRING,
  },
  tags: {
    type: DataTypes.INTEGER,
    references: {
      model: "tags",
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("available", "pending", "sold"),
    defaultValue: null,
  },
});

module.exports = Pet;
