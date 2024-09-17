const express = require("express");
const Comment = require("../models/Comment");
const Spot = require("../models/Spot");
const User = require("../models/User");

const router = express.Router();

// Create a new comment on a spot
router.post("/:spotId", async (req, res) => {
  try {
    const { commentText, userId } = req.body;
    const newComment = await Comment.create({
      commentText,
      userId,
      spotId: req.params.spotId,
    });

    // Include the user information in the response
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: User, // Assuming you have a User model associated with Comment
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all comments for a spot
router.get("/:spotId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { spotId: req.params.spotId },
      include: [
        {
          model: User,
          attributes: ["username"], // Fetch only username
        },
      ],
    });

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this spot" });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a comment by ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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
