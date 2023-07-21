const DataTypes = require("sequelize");
const sequelize = require("../db/connection");

const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/

const User = sequelize.define("users", {
    username:{type:DataTypes.STRING,allowNull:false,unique: true,},
    firstname:{type:DataTypes.STRING,allowNull:false},
    lastname:{type:DataTypes.STRING,allowNull:false},
    email:{type:DataTypes.STRING,allowNull:false,unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address.",
          }
        },},
    password:{type:DataTypes.STRING,allowNull:false},
    phone:{type:DataTypes.STRING,allowNull:false,validate: {
        validator: function(v) {
            return phoneValidationRegex.test(v); 
        },
    }},
    userStatus: { type: DataTypes.BOOLEAN, defaultValue: 1 },
});

module.exports = User;
