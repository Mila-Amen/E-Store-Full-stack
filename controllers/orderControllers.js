import OrdersModel from "../models/orderSchema.js";
import UsersModel from "../models/userSchema.js";
import jwt from "jsonwebtoken";
export const getAllOrders = async (req, res, next) => {
  // get all orders from database and send to client
  try {
    const orders = await OrdersModel.find()
      .populate("products", "title price -_id")
      .populate("userId", "first_name -_id"); // reading data from orders collection
    res.send({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const getSingleOrder = async (req, res, next) => {
  // get a single orders from database and send to client
  try {
    /*  const singleOrder = await OrdersModel.findOne({
      title: req.params.title,
    }); */
    const singleOrder = await OrdersModel.findById(req.params.id);
    res.send({ success: true, data: singleOrder });
  } catch (err) {
    next(err);
  }
};

export const createNewOrder = async (req, res, next) => {
  // create a new order in  database and send to client
  try {
    const order = await OrdersModel.create(req.body);
    /* {
  "userId":"67b2f69404ccf613b3878b86",
  "products":["67add09179303cc51ad5ea2e"],
  "totalPrice":1100
} */
    /* const user = await UsersModel.findById(req.body.userId)
user.orders.push(order._id)
await user.save() */

    const user = await UsersModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { orders: order._id } },
      { new: true }
    );

    res.send({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};
export const updateSingleOrder = async (req, res, next) => {
  try {
    const updatedOrder = await OrdersModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send({ success: true, data: updatedOrder });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleOrder = async (req, res, next) => {
  try {
    const deletedOrder = await OrdersModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, data: deletedOrder });
  } catch (err) {
    next(err);
  }
};

// model.find()
// model.findById()
// model.findOne({title:req.params.title})
// model.create()
// model.findByIdAndUpdate()
// model.findByIdAndDelete()
