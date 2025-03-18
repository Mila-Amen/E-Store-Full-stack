import jwt from "jsonwebtoken";
import UsersModel from "../models/userSchema.js";
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (token) {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (!decode) throw new Error("invalid token");
      //decode {_id:"214441qwewqe", email:"user@email"}
      const user = await UsersModel.findById(decode._id);
      req.user = user;
      next(); //forwarding request to next handler
    } else {
      res.send({ success: false, message: "token is required!" });
    }
  } catch (err) {
    next(err); // forwarding request along with error
  }
};
