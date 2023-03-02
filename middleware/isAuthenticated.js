const User = require("../model/User");
const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer", "");
    const user = await User.findOne({token: token}).select("account _id");
    if (user) {
      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json({message: "Vous n'etez pas autoriser a faire cette action"});
    }
  } else {
    res
      .status(401)
      .json({message: "Vous n'etez pas autoriser a faire cette action"});
  }
};
module.exports = isAuthenticated;
