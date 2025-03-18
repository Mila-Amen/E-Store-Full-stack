import { Schema, model } from "mongoose";


const productSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    decription: { type: String },
    sizes: { type: String, enum: ["XL", "L", "M", "S", "XS"] },
    price: { type: Number, required: true },
    rating: { type: String },
    inventory: { type: Number, required: true },
    image_url: { type: String },
  },
  { timestamps: true }
);

//create a model
const ProductsModel = model("Product", productSchema);

export default ProductsModel;

/* 
gender : {type:String, enum:["male","female"]}, 
role: {type:String, enum:["user","admin","manager"]} */
