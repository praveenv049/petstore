const { Op } = require("sequelize");
const User = require("../models/user.model");
const statusCodes = require("http-status-codes");
const schema = require("../middlewares/user.validator");
const generateAccessToken = require("../middlewares/jwt");

exports.create = async (req, res) => {
  const params = req.body;
  let result = {
    success: false,
    message: {
      "Required fields": [
        "username",
        "firstname",
        "lastname",
        "email",
        "password",
        "phone",
      ],
    },
  };
  if (Object.entries(params).length === 0) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const { error } = schema.createSchema.validate(params);
    if (error) {
      result.message = error.details[0].message;
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      let user = await User.findOne({
        where: {
          [Op.or]: [{ username: params.username }, { email: params.email }],
        },
      });
      if (user === null) {
        await User.create(params)
          .then((data) => {
            result.success = true;
            result.message = "User create successfully.";
            result.result = data;
            res.status(statusCodes.OK).send(result);
          })
          .catch((err) => {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
              message:
                err.message || "Some error occurred while add the new pet.",
            });
          });
      }
    }
  }
};

exports.login = async (req, res) => {
  const params = req.body;
  let result = {
    success: false,
    message: "username and password required.",
  };
  if (Object.entries(params).length === 0) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const { error } = schema.userLogin.validate(params);
    if (error) {
      result.message = error.details[0].message;
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      let user = await User.findOne({ where: { username: params.username } });
      if (user === null) {
        result.message = "Please provide valid username.";
        res.status(statusCodes.BAD_REQUEST).send(result);
      } else if (user.password === params.password) {
        result.success = true;
        result.message = "Login successfully.";
        user.token = generateAccessToken({ user });
        delete user["password"];
        result.result = user;
        res.status(statusCodes.OK).send(result);
      } else {
        result.message = "Invalid password.";
        res.status(statusCodes.BAD_REQUEST).send(result);
      }
    }
  }
};

exports.logout = async (req, res) => {
  const authHeader = req.headers["cookie"];
  if (!authHeader)
    return res.status(statusCodes.OK).send({ message: "Successfully logout." });
  const cookie = authHeader.split("=")[1];
  const accessToken = cookie.split(";")[0];
  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
  if (checkIfBlacklisted)
    return res.status(statusCodes.OK).send({ message: "Successfully logout." });
  const newBlacklist = new Blacklist({
    token: accessToken,
  });
  await newBlacklist.save();
  res.setHeader("Clear-Site-Data", '"cookies", "storage"');
  res.status(statusCodes.OK).send({ message: "You are logged out!" });
};

exports.update = async (req, res) => {
  const username = req.params.username;
  const params = req.body;
  let result = {
    success: false,
    message: "Please provide detail for update.",
  };
  if (Object.entries(params).length === 0) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const user = await User.findOne({ where: { username: username } });
    if (user === null) {
      result.message = "Please provide valid username.";
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else if (
      !params.username ||
      !params.firstname ||
      !params.lastname ||
      !params.email ||
      !params.password ||
      !params.phone
    ) {
      result.message = {
        "Please provide value to at least one of these": [
          "username",
          "firstname",
          "lastname",
          "email",
          "password",
          "phone",
        ],
      };
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      result.success = true;
      await User.update({ params }, { where: { username: username } });
      result.message = `Information updated successfully on ID ${username}.`;
      res.status(statusCodes.OK).send(result);
    }
  }
};

exports.getUser = async (req, res) => {
  const username = req.params.username;
  let result = { success: false, message: "Please provide valid username." };
  const user = await User.findOne({ where: { username: username } });
  if (user === null) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    result.success = true;
    result.message = `User's details fetch successfully on username ${username}.`;
    result.result = user;
    res.status(statusCodes.OK).send(result);
  }
};

exports.delete = async (req, res) => {
  const username = req.params.username;
  let result = { success: false, message: "Please provide valid username." };
  const user = await User.findOne({ where: { username: username } });
  if (user === null) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    result.success = true;
    result.message = `User's details deleted successfully on username ${username}.`;
    await User.destroy({ where: { username: username } });
    res.status(statusCodes.OK).send(result);
  }
};

exports.bulkCreate = async (req, res) => {
  const params = req.body;
  let result = {
    success: false,
    message: "Required users information in array.",
  };
  if (params.length > 0) {
    console.log(params);
    const usrers = await User.bulkCreate(params);
    result.success = true;
    result.message = "Users create successfully.";
    result.result = usrers;
    res.status(statusCodes.OK).send(result);
  } else {
    res.status(statusCodes.BAD_REQUEST).send(result);
  }
};
