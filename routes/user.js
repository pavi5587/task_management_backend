const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../middleware/cypto");

router.post("/register", async (req, res) => {
  const { name, email, mobileNumber, password, country, city, state, gender } =
    req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    mobileNumber,
    country,
    city,
    state,
    gender,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User Registered" });
  } catch (error) {
    res.status(400).json({ message: "Error Registering User" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("user", user);

  if (!user) return res.status(400).json({ message: "User Not Found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

  const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: "1h",
  });

  res.json({ token, user: user });
});

module.exports = router;
