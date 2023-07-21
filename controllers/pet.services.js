const merge = require("deepmerge");
const { Op } = require("sequelize");
const constents = require("../constents");
const Tag = require("../models/tag.model");
const Pet = require("../models/pet.model");
const statusCodes = require("http-status-codes");
const Category = require("../models/category.model");
const schema = require("../middlewares/pet.validator");

exports.create = async (req, res) => {
  const params = req.body;
  if (Object.entries(params).length === 0) {
    constents.errorResult.message = constents.petCreateRequiredFields;
    res.status(statusCodes.BAD_REQUEST).send(constents.errorResult);
  } else {
    const { error } = schema.validate(params);
    if (error) {
      constents.errorResult.message = error.details[0].message;
      res.status(statusCodes.BAD_REQUEST).send(constents.errorResult);
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
          constents.successResult.message = constents.petCreateSuccess;
          constents.successResult.result = data;
          res.status(statusCodes.OK).send(constents.successResult);
        })
        .catch(() => {
          constents.errorResult.message =
            constents.petCreatdeInternalServerError;
          res
            .status(statusCodes.INTERNAL_SERVER_ERROR)
            .send(constents.errorResult);
        });
    }
  }
};

exports.findAll = async (req, res) => {
  constents.successResult.message = constents.petFetchSuccess;
  constents.successResult.result = await Pet.findAll({});
  if (constents.successResult.result.length > 0) {
    for (const key in constents.successResult.result) {
      constents.successResult.result[key].category = await Category.findOne({
        attributes: constents.attributes,
        where: { id: constents.successResult.result[key].category },
      });
      constents.successResult.result[key].tags = await Tag.findOne({
        attributes: constents.attributes,
        where: { id: constents.successResult.result[key].tags },
      });
    }
    res.status(statusCodes.OK).send(constents.successResult);
  } else {
    constents.errorResult.message = petFetchNotFound;
    res.status(statusCodes.NOT_FOUND).send(constents.errorResult);
  }
};

exports.update = async (req, res) => {
  const file = req.file;
  const id = req.params.id;
  const params = req.body;
  if (file == undefined && Object.entries(params).length === 0) {
    constents.errorResult.message = constents.petProvideInput;
    res.status(statusCodes.BAD_REQUEST).send(constents.errorResult);
  } else {
    const pet = await Pet.findOne({ where: { id: id } });
    if (pet === null) {
      constents.errorResult.message = constents.petProvideId;
      res.status(statusCodes.BAD_REQUEST).send(constents.errorResult);
    } else if (file !== undefined) {
      await Pet.update(
        { photoURL: constents.directoryName + file.originalname },
        { where: { id: id } }
      );
      constents.successResult.message = `Image updated successfully on ID ${id}.`;
      res.status(statusCodes.OK).send(constents.successResult);
    } else if (params.name || params.tags || params.status || params.category) {
      if (params.tags) {
        let tag = await Tag.findOne({ where: { name: params.tags } });
        if (tag === null) {
          tag = await Tag.create({ name: params.tags });
        }
        params.tags = tag.id;
      }
      if (params.category) {
        let category = await Category.findOne({
          where: { name: params.category },
        });
        if (category === null) {
          category = await Category.create({ name: params.category });
        }
        params.category = category.id;
      }
      await Pet.update(params, { where: { id: id } });
      constents.successResult.message = `Information updated successfully on ID ${id}.`;
      res.status(statusCodes.OK).send(constents.successResult);
    } else {
      constents.errorResult.message = constents.petUpdateRequiredFields;
      res.status(statusCodes.BAD_REQUEST).send(constents.errorResult);
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
      attributes: constents.attributes,
      where: { id: pet.category },
    });
    pet.tags = await Tag.findOne({
      attributes: constents.attributes,
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
            attributes: constents.attributes,
            where: { id: result.result[key].category },
          });
          result.result[key].tags = await Tag.findOne({
            attributes: constents.attributes,
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
          attributes: constents.attributes,
          where: { id: result.result[key].category },
        });
        result.result[key].tags = await Tag.findOne({
          attributes: constents.attributes,
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
