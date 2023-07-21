const DataTypes = require("sequelize");
const sequelize = require("../db/connection");

const Tag = sequelize.define("tags", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Tag;
