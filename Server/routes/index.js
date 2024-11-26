const express = require("express");

// Import individual route files
const authRoutes = require("./auth");
const commentRoutes = require("./comments");
const spotRoutes = require("./spots");
const userRoutes = require("./user");

const router = express.Router();

// Use the routes under /api prefix
router.use("/api/auth", authRoutes); // Routes under /api/auth
router.use("/api/comments", commentRoutes); // Routes for comments
router.use("/api/spots", spotRoutes); // Routes for spots
router.use("/api/users", userRoutes); // Routes for users

module.exports = router;
