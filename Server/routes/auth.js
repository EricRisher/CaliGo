require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { clerkClient, requireAuth } = require("@clerk/express");

// Profile route protected by Clerk
router.get("/profile", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth; // Use Clerk's auth object
    const user = await clerkClient.users.getUser(userId); // Fetch user data from Clerk

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ error: "Failed to fetch profile information." });
  }
});

// Signup Route (Custom JWT-based authentication)
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input...

    // Check if user exists...
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create new user (Ensure password is hashed)
    const newUser = await User.create({ username, email, password });

    // Generate JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: false, // This should ideally be set to true in production
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Login Route (Custom JWT-based authentication)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Verify password (assuming you have a method to compare passwords)
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  // Clear the token cookie to log the user out
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.json({ message: "Logged out" });
});

// Forgot password route (Custom)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token (random and secure)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set token and its expiration (e.g., 1 hour) in the database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send an email with the reset token (URL with token as query parameter)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    sendPasswordResetEmail(user.email, resetUrl);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
