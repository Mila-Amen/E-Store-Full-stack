import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

//create a model
const OrdersModel = model("Order", orderSchema);

export default OrdersModel;
