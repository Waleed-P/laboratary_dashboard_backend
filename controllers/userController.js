const users = require("../models/userModal");
const jwtPassword = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  console.log("inside register function");
  const { username, password, email } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(400).json("user already exists");
    } else {
      const newUser = new users({
        username,
        email,
        password,
      });
      await newUser.save();
      res.status(200).json(newUser);
    }
  } catch (e) {
    res.status(401).json(e);
  }
  res.end();
};

exports.login = async (req, res) => {
  console.log("inside login function");
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email, password });
    if (existingUser) {
      const token = jwt.sign({ userId: existingUser._id }, jwtPassword);
      res.status(200).json({
        existingUser,
        token,
      });
    }
  } catch (e) {
    res.status(400).json(e);
  }
};
