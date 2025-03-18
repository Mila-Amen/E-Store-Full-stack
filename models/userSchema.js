import { Schema, model } from "mongoose";
import { addressSchema } from "./adressSchema.js";

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please provide us with your first name!"],
    },
    last_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, "email should be unique"],
    },
    password: {
      type: String,
      required: true,
      /*  validate: {
        validator: function (value) {
          return value.length > 3 && value.length < 15;
        },
        message: "your password should be in btw 3-15 characters long",
      }, */
    },
    profile_avatar: {
      type: String,
      default: function () {
        return `https://robohash.org/${this.last_name}`;
      },
    },
    address: addressSchema /* take it as a document and embed here */,
    /*  address: {
      city:{type:String},
      country:{type:String},
      contactInfo:{type:Number}
    } */
    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

//create a model
const UsersModel = model("User", userSchema);

export default UsersModel;
