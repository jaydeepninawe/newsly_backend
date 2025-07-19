// middleware/verifyAdmin.js
const jwt = require("jsonwebtoken")
const Token = require("../models/TokenSchema")

async function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  console.log("Authorization header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {
    // Verify JWT signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check token is in DB and not expired
    const exists = await Token.findOne({ token })
    if (!exists) return res.status(401).json({ message: "Session expired" })

    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" })
  }
}

module.exports = verifyAdmin
