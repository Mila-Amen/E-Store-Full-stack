import ProductsModel from "../models/productSchema.js";

export const getAllProducts = async (req, res, next) => {
  // get all products from database and send to client
  try {
    const products = await ProductsModel.find(); // reading data from products collection
    res.send({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getSingleProduct = async (req, res, next) => {
  // get a single products from database and send to client
  try {
    /*  const singleProduct = await ProductsModel.findOne({
      title: req.params.title,
    }); */
    const singleProduct = await ProductsModel.findById(req.params.id);
    res.send({ success: true, data: singleProduct });
  } catch (err) {
    next(err);
  }
};

export const createNewProduct = async (req, res, next) => {
  // create a new product in  database and send to client
  try {
    const product = await ProductsModel.create(req.body);
    res.send({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};
export const updateSingleProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send({ success: true, data: updatedProduct });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleProduct = async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, data: deletedProduct });
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

// next() forwarding only request
// next(err) forwarding request along with error
