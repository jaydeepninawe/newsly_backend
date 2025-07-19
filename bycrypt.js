const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ninawejay3002:ezq0pbZH7oms2k5H@newsly.zquvoi9.mongodb.net/?retryWrites=true&w=majority&appName=newsly').then(() => 
  {
    console.log("Connected to MongoDB");
  }).catch((err) => {
    console.error("MongoDB connection error:", err)});

const App = express();
App.use(express.json());

App.post("/", async (req, res) => {
  const { email, password } = req.body;
  console.log("Creating admin with email:", req.body.email);
  console.log("Creating admin with password:", req.body.password);  

  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashed);
    const admin = await Admin.create({ email, password:hashed });

    res.status(201).json({ message: "✅ Admin created", id: admin._id });
});

App.listen(5001, () => {
  console.log("Server is running on port 5001");
}

);