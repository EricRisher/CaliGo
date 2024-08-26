const express = require("express");
const Spot = require("../models/Spot");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Create a new spot (protected route)
router.post("/spots", authenticateToken, async (req, res) => {
  try {
    const spot = await Spot.create({ ...req.body, userId: req.user.id });
    res.status(201).json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
