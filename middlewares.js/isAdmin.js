export const isAdmin = async (req, res, next) => {
  console.log(req.user._id.toString(), req.params.id);
  try {
    if (req.user.role === "admin") {
      next();
    } else if (
      req.user.orders.includes(req.params.id) ||
      req.user._id.toString() === req.params.id
    ) {
      next();
    } else {
      throw new Error("you are not authorized!");
    }
  } catch (err) {
    next(err);
  }
};
