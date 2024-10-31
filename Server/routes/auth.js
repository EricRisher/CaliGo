require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Spot } = require("../models");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if the user already exists by email or username
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Directly pass the password to the User model, without hashing it
    await User.create({ username, email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("User not found for username:", username);
      return res.status(400).json({ message: "User not found" });
    }

    // Use the model's validatePassword method to check password
    const isMatch = await user.validatePassword(password.trim());
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch for user:", username);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token and set it as a cookie
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json({ message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      attributes: ["username"],
      include: [
        { model: Spot, as: "mySpots" }, // Spots created by the user
        { model: Spot, as: "SavedSpots" }, // Spots saved by the user
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      mySpots: user.mySpots,
      savedSpots: user.SavedSpots,
    });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the JWT token from cookies
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
