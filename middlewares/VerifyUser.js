const JWT = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    JWT.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        res.user = false;
        return res.json({ status: false, user: false });
      } else {
        res.user = user;
        next();
      }
    });
  } else {
    return res.json({ status: "You are not authenticated", user: false });
  }
};

module.exports = verifyUser;
