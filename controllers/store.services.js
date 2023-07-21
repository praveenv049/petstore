const Pet = require("../models/pet.model");
const Order = require("../models/order.model");
const statusCodes = require("http-status-codes");
const schema = require("../middlewares/order.validator");

exports.place = async (req, res) => {
  const params = req.body;
  let result = {
    success: false,
    message: {
      "Required fields": [
        "petId",
        "quantity",
        "shipDate",
        "complete",
      ],
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
      let pet = await Pet.findOne({ where: { id: params.petId } });
      if (pet === null) {
        result.message = "Please provide valid petId.";
        res.status(statusCodes.BAD_REQUEST).send(result);
      }else
      {await Order.create(params)
        .then((data) => {
          result.success = true;
          result.message = "Order placed successfully.";
          result.result = data;
          res.status(statusCodes.OK).send(result);
        })
        .catch((err) => {
          res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            message:
              err.message || "Some error occurred while add the new pet.",
          });
        });}
    }
  }
};

exports.find=async (req,res)=>{
    const id = req.params.id;
  let result = { success: false, message: "Please provide valid ID." };
  const order = await Order.findOne({ where: { id: id } });
  if (order === null) {
    res.status(statusCodes.BAD_REQUEST).send(result);
  } else {
    result.success = true;
    result.message = `Order's details fetch successfully on ID ${id}.`;
    result.result = order;
    res.status(statusCodes.OK).send(result);
  }
}

exports.delete = async (req, res) => {
    const id = req.params.id;
    let result = { success: false, message: "Please provide valid ID." };
    const order = await Order.findOne({ where: { id: id } });
    if (order === null) {
      res.status(statusCodes.BAD_REQUEST).send(result);
    } else {
      result.success = true;
      result.message = `Order's details deleted successfully on ID ${id}.`;
      await Order.destroy({ where: { id: id } });
      res.status(statusCodes.OK).send(result);
    }
}  

exports.list = async (req, res) => {
    const status = req.params.status;
    let result = {
      success: true,
      message: `Successfully fetched orders information by status ${status}.`,
    };
    if (["placed", "approved", "delivered"].includes(status)) {
      result.result = await Order.findAll({ where: { status: status } });
      if (result.result.length > 0) {
        res.status(statusCodes.OK).send(result);
      } else {
        result.success = false;
        result.message = `Orders information not found on the status ${status}.`;
        res.status(statusCodes.BAD_REQUEST).send(result);
      }
    } else {
      result.success = false;
      result.message = "Please provide valid status.";
      res.status(statusCodes.BAD_REQUEST).send(result);
    }
  };