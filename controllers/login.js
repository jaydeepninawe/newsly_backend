const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Admin = require("../models/Admin")
const Token = require("../models/TokenSchema")

const login =  async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt with email:", email, password); 
  const admin = await Admin.findOne({ email });
  console.log("Admin found:", admin);
  if (!admin) return res.status(401).json({ message: "Invalid credentials" })

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })

  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  })

  // Save token in DB
  await Token.create({ token })

  res.json({ token })
}

module.exports = {
  login  };
