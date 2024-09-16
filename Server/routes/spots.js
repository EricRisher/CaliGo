const express = require("express");
const Spot = require("../models/Spot");
const User = require("../models/User");
const Comment = require("../models/Comment");

const router = express.Router();

// Create a new spot
router.post("/", async (req, res) => {
  try {
    const spot = await Spot.create(req.body);
    res.status(201).json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: {
        model: User,
        attributes: { exclude: ["password"] }, // Exclude password field from the response
      },
    });
    res.status(200).json(spots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching spots." });
  }
});

// Get a spot by ID
router.get("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id, {
      include: [User, Comment],
    });
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    res.status(200).json(spot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a spot by ID
router.put("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    await spot.update(req.body);
    res.status(200).json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a spot by ID
router.delete("/:id", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.id);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    await spot.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
