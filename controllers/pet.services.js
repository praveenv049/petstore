const { Op } = require("sequelize");
const Tag = require("../models/tag.model");
const Pet = require("../models/pet.model");
const statusCodes = require("http-status-codes");
const Category = require("../models/category.model");
const schema = require("../middlewares/pet.validator");

exports.create = async (req, res) => {
  const params = req.body;
  let result = {
    success: false,
    message: {
      "Required fields": ["name", "tags", "status", "category", "photoURL"],
    },
  };
  if (Object.entries(params).length === 0) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const { error } = schema.validate(params);
    if (error) {
      result.message = error.details[0].message;
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      let tag = await Tag.findOne({ where: { name: params.tags } });
      if (tag === null) {
        tag = await Tag.create({ name: params.tags });
      }
      let category = await Category.findOne({
        where: { name: params.category },
      });
      if (category === null) {
        category = await Category.create({ name: params.category });
      }
      params.tags = tag.id;
      params.category = category.id;
      await Pet.create(params)
        .then((data) => {
          data.tags = tag.name;
          data.category = category.name;
          result.success = true;
          result.message = "Successfully add a new pet.";
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
};

exports.findAll = async (req, res) => {
  let result = {
    success: true,
    message: "Successfully fetched pets information.",
  };
  result.result = await Pet.findAll({});
  if (result.result.length > 0) {
    for (const key in result.result) {
      result.result[key].category = await Category.findOne({
        attributes: ["id", "name"],
        where: { id: result.result[key].category },
      });
      result.result[key].tags = await Tag.findOne({
        attributes: ["id", "name"],
        where: { id: result.result[key].tags },
      });
    }
    res.status(statusCodes.OK).send(result);
  } else {
    result.success = false;
    result.message = "Pets information not found.";
    res.status(statusCodes.NOT_FOUND).send(result);
  }
};

exports.update = async (req, res) => {
  const file = req.file;
  const id = req.params.id;
  const params = req.body;
  let result = {
    success: false,
    message: "Please update image or update detail.",
  };
  if (file == undefined && Object.entries(params).length === 0) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const pet = await Pet.findOne({ where: { id: id } });
    if (pet === null) {
      result.message = "Please provide valid ID.";
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else if (file !== undefined) {
      await Pet.update(
        { photoURL: "/uploads/" + file.originalname },
        { where: { id: id } }
      );
      result.message = `Image updated successfully on ID ${id}.`;
      res.status(statusCodes.OK).send(result);
    } else if (
      !params.category ||
      !params.name ||
      !params.tags ||
      !params.status
    ) {
      result.message = {
        "Please provide value to at least one of these": [
          "name",
          "tags",
          "status",
          "category",
        ],
      };
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      result.success = true;
      await Pet.update({ params }, { where: { id: id } });
      result.message = `Information updated successfully on ID ${id}.`;
      res.status(statusCodes.OK).send(result);
    }
  }
};

exports.uploadImage = async (req, res) => {
  const file = req.file;
  const id = req.params.id;
  let result = { success: false, message: "Please select a image." };
  if (file == undefined) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    const pet = await Pet.findOne({ where: { id: id } });
    if (pet === null) {
      result.message = "Please provide valid ID.";
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      await Pet.update(
        { photoURL: "/uploads/" + file.originalname },
        { where: { id: id } }
      );
      result.success = true;
      result.message = `Image uploaded successfully on ID ${id}.`;
      res.status(statusCodes.OK).send(result);
    }
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  let result = { success: false, message: "Please provide valid ID." };
  const pet = await Pet.findOne({ where: { id: id } });
  if (pet === null) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    result.success = true;
    result.message = `Pet's details fetch successfully on ID ${id}.`;
    pet.category = await Category.findOne({
      attributes: ["id", "name"],
      where: { id: pet.category },
    });
    pet.tags = await Tag.findOne({
      attributes: ["id", "name"],
      where: { id: pet.tags },
    });
    result.result = pet;
    res.status(statusCodes.OK).send(result);
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  let result = { success: false, message: "Please provide valid ID." };
  const pet = await Pet.findOne({ where: { id: id } });
  if (pet === null) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    result.success = true;
    result.message = `Pet's details deleted successfully on ID ${id}.`;
    await Pet.destroy({ where: { id: id } });
    res.status(statusCodes.OK).send(result);
  }
};

exports.findByTag = async (req, res) => {
  const tag = req.params.tag;
  let array1 = [];
  let result = {
    success: true,
    message: `Successfully fetched pets information by tag ${tag}.`,
  };
  const tags = await Tag.findAll({});
  if (tags.length > 0) {
    for (const key in tags) {
      const names = tags[key].name.split(",");
      if (names.includes(tag)) {
        array1.push(tags[key].id);
      }
    }
    if (array1.length > 0) {
      result.result = await Pet.findAll({
        where: { tags: { [Op.in]: array1 } },
      });
      if (result.result.length > 0) {
        for (const key in result.result) {
          result.result[key].category = await Category.findOne({
            attributes: ["id", "name"],
            where: { id: result.result[key].category },
          });
          result.result[key].tags = await Tag.findOne({
            attributes: ["id", "name"],
            where: { id: result.result[key].tags },
          });
        }
        res.status(statusCodes.OK).send(result);
      } else {
        result.success = false;
        result.message = `Pets information not found on the tag ${tag}.`;
        res.status(statusCodes.BAD_REQUEST).send(result);
      }
    } else {
      result.success = false;
      result.message = "Please provide valid tag.";
      res.status(statusCodes.BAD_REQUEST).send(result);
    }
  } else {
    result.success = false;
    result.message = "Tag information not found.";
    res.status(statusCodes.NOT_FOUND).send(result);
  }
};

exports.findByStatus = async (req, res) => {
  const status = req.params.status;
  let result = {
    success: true,
    message: `Successfully fetched pets information by status ${status}.`,
  };
  if (["available", "pending", "sold"].includes(status)) {
    result.result = await Pet.findAll({ where: { status: status } });
    if (result.result.length > 0) {
      for (const key in result.result) {
        result.result[key].category = await Category.findOne({
          attributes: ["id", "name"],
          where: { id: result.result[key].category },
        });
        result.result[key].tags = await Tag.findOne({
          attributes: ["id", "name"],
          where: { id: result.result[key].tags },
        });
      }
      res.status(statusCodes.OK).send(result);
    } else {
      result.success = false;
      result.message = `Pets information not found on the status ${status}.`;
      res.status(statusCodes.BAD_REQUEST).send(result);
    }
  } else {
    result.success = false;
    result.message = "Please provide valid status.";
    res.status(statusCodes.BAD_REQUEST).send(result);
  }
};
