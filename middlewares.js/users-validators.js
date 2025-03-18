import { body, validationResult } from "express-validator";
export const validators = [
  body("email")
    .isEmail()
    .withMessage("this is not proper valid email!")
    .normalizeEmail(),
  body("password")
    .isStrongPassword()
    .withMessage("password is too weak!")
    .trim(),
  body("last_name")
    .isString()
    .withMessage("this is not a valid string")
    .isLength({ min: 3, max: 15 })
    .withMessage("it is too short or too long ...")
    .escape()
    .customSanitizer((value) => value.replace(/["§$%&/()=?]/g, "")),
  body("first_name")
    .custom((value) => {
      //custom validator
      if (value.length > 10) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("first name should not be longer than 10 characters longs"),
  (req, res, next) => {
    //checking the errors in the req
    const results = validationResult(req);
    if (results.isEmpty()) {
      next();
    } else {
      res.status(404).send({ success: false, messagwe: results.errors });
    }
  },
];
