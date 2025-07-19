// models/Token.js
const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 } // expires in 1 hour
})

module.exports = mongoose.model("Token", tokenSchema)
