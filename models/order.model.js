const DataTypes = require("sequelize");
const sequelize = require("../db/connection");

const Order = sequelize.define("orders", {
  petId: { type: DataTypes.INTEGER, references: { model: "pets", key: "id" } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  shipDate: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("placed", "approved", "delivered"),
    defaultValue: "placed",
  },
  complete: { type: DataTypes.BOOLEAN, defaultValue: 0 },
});

module.exports = Order;
