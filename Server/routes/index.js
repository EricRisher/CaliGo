const express = require("express");

// Import individual route files
const authRoutes = require("./auth");
const commentRoutes = require("./comments");
const spotRoutes = require("./spots");
const userRoutes = require("./user");

const router = express.Router();

// Use the routes
router.use("/auth", authRoutes); // Routes under /auth
router.use("/comments", commentRoutes); // Routes for comments (e.g., /comments/:spotId)
router.use("/spots", spotRoutes); // Routes for spots (e.g., /spots/:id)
router.use("/users", userRoutes); // Routes for users (e.g., /users/:id)

// Export the router
module.exports = router;
