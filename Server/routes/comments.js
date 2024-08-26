const express = require("express");
const Comment = require("../models/Comment");
const Spot = require("../models/Spot");
const User = require("../models/User");

const router = express.Router();

// Create a new comment on a spot
router.post("/spots/:spotId/comments", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    const comment = await Comment.create({
      ...req.body,
      spotId: req.params.spotId,
      userId: req.body.userId, // Assume userId is passed in the request body
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all comments for a spot
router.get("/spots/:spotId/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { spotId: req.params.spotId },
      include: User,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a comment by ID
router.put("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await comment.update(req.body);
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment by ID
router.delete("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
