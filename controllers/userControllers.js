import UsersModel from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ImageModel from "../models/imageSchema.js";
export const getAllUsers = async (req, res, next) => {
  // get all users from database and send to client
  try {
    const users = await UsersModel.find(); // reading data from users collection
    res.send({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const getSingleUser = async (req, res, next) => {
  // get a single users from database and send to client
  try {
    /*  const singleUser = await UsersModel.findOne({
      title: req.params.title,
    }); */
    const singleUser = await UsersModel.findById(req.params.id).populate(
      "orders"
    );
    res.send({ success: true, data: singleUser });
  } catch (err) {
    next(err);
  }
};

//signup // register
export const createNewUser = async (req, res, next) => {
  // create a new user in  database and send to client

  // Validation validate data
  // Sanitization sanitize/normalizing data
  try {
    // conditions to validate our data and normalize it

    //Express validator (express-validator)
    // req.body
    // catch any incoming errors from express-validator middlewares

    // if request reaches to this part, everything is okay

    // hash user password before creating user
    /*    console.log(bcrypt.genSaltSync(5)); */
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    if (req.file) {
      const image = await ImageModel.create({
        filename: Date.now() + "_" + req.file.originalname,
        data: req.file.buffer,
      });
      req.body.profile_avatar = `http://localhost:5000/images/${image.filename}`;
    }
    const user = await UsersModel.create(req.body);
    /*  const user = await UsersModel.create({
      ...req.body,
      password: hashedPassword,
    }); */
    res.send({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    //  "email":"test3@gmail.com",
    //    "password":"Helloworld@123"

    // in db hashed password  => $2b$10$O5hTpQOgcWYYTvAFYWzSQuBcVITFAvsmtdEsPqJNq3Pzok5eaYOYe
    const user = await UsersModel.findOne({ email: req.body.email });
    if (user) {
      const check = bcrypt.compareSync(req.body.password, user.password);
      if (check) {
        //authenticate the user
        // issue token jwt.sign(payload, secret key(signature))
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.SECRET_KEY
        );

        /*   res.send({ success: true, data: user, token }); */
        /*         res.header("token", token).send({ success: true, data: user }); */
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
          })
          .send({ success: true, data: user });
        /* res.cookie("token", token).send({ success: true, data: user }); */
      } else {
        throw new Error("password doesn't match..");
      }
    } else {
      throw new Error("no such email exist ...");
    }
  } catch (err) {
    next(err);
  }
};
export const updateSingleUser = async (req, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.send({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const deleteSingleUser = async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.id);
    res.send({ success: true, data: deletedUser });
  } catch (err) {
    next(err);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    if (!payload) {
      return next("token is invalid !");
    } else {
      const user = await UsersModel.findById(payload._id).populate({
        path: "orders",
        populate: {
          path: "products",
          model: "Product",
        },
      });
      console.log(user.orders[0].products);
      res.send({ success: true, data: user });
    }
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
