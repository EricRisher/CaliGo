const express = require("express");
const Comment = require("../models/Comment");
const Spot = require("../models/Spot");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/:spotId", authMiddleware, async (req, res) => {
  try {
    const { commentText } = req.body;

    // Access the authenticated user's ID directly as `req.user.id`
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ error: "User ID is missing from request." });
    }

    const newComment = await Comment.create({
      commentText,
      userId, // Properly pass the `userId`
      spotId: req.params.spotId,
    });

    // Include the user information in the response
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: {
        model: User,
        as: "commentAuthor", // Ensure alias matches the model definition
        attributes: ["id", "username"],
      },
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error("Error creating comment:", error);
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
          as: "commentAuthor", // Use the correct alias here
          attributes: ["username"], // Fetch only the username
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
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a comment by ID (Protected Route)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Ensure the authenticated user is the comment owner
    if (comment.userId !== req.auth.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this comment" });
    }

    await comment.update(req.body);
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment by ID (Protected Route)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Ensure the authenticated user is the comment owner
    if (comment.userId !== req.auth.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
