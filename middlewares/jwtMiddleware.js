const jwt = require("jsonwebtoken");
const jwtMiddleware = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (token) {
    try {
      const jwtResponse = jwt.verify(token, process.env.JWT_SECRET);
      req.payload = jwtResponse.userId;
      next();
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(406).json("please provide valid token");
  }
};
module.exports = jwtMiddleware;