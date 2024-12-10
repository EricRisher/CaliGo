const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Spot, User, Comment, Like } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Set the base upload directory on the server-side
const baseUploadPath = path.join(__dirname, "../uploads");
console.log("Base Upload Path:", baseUploadPath);

if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userUploadPath = path.join(baseUploadPath, req.user.id.toString()); // Create user-specific folder
    if (!fs.existsSync(userUploadPath)) {
      fs.mkdirSync(userUploadPath, { recursive: true });
    }
    cb(null, userUploadPath); // Save to user-specific folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

router.get("/spot-count", async (req, res) => {
  try {
    const count = await Spot.count();
    res.json({ total: count });
  } catch (error) {
    console.error("Error fetching spot count:", error);
    res.status(500).json({ error: "Failed to fetch spot count" });
  }
});

// Create a new spot (Protected Route)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { spotName, description, location } = req.body;

    // Ensure location exists and split into latitude and longitude
    if (!location) {
      return res.status(400).json({
        message:
          "Location is required and should be in 'latitude, longitude' format.",
      });
    }

    const [latitude, longitude] = location
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: "Invalid coordinates format. Use 'latitude, longitude'.",
      });
    }

    // Generate the relative path for the image (e.g., /uploads/userId/image.jpg)
    const imagePath = req.file
      ? `/uploads/${req.user.id}/${req.file.filename}`
      : null;

    // Create the new spot
    const newSpot = await Spot.create({
      spotName,
      description,
      location,
      latitude,
      longitude,
      image: imagePath,
      userId: req.user.id, // Authenticated user ID
    });

    res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating new spot:", error);
    res.status(500).json({ message: "Failed to add the spot" });
  }
});

// Get all spots
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    const spots = await Spot.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
        {
          model: Comment,
          as: "Comments",
          attributes: ["id", "commentText"],
        },
        {
          model: User, // Reference to User model through Likes
          as: "UsersWhoLiked", // Alias used in the relationship
          attributes: ["id"],
          through: { attributes: [] }, // Exclude intermediate table fields
          where: { id: userId },
          required: false, // Include even if user hasn't liked the spot
        },
      ],
      order: [["id", "DESC"]],
    });

    const spotsWithLikeState = spots.map((spot) => ({
      ...spot.toJSON(),
      userLiked: spot.UsersWhoLiked.length > 0, // Check if user liked the spot
      commentCount: spot.Comments ? spot.Comments.length : 0,
    }));

    res.status(200).json(spotsWithLikeState);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Failed to fetch spots" });
  }
});

// Get a spot by spotId
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
      console.log(`No comments found for spot ID ${req.params.spotId}`);
      return res
        .status(404)
        .json({ message: "No comments found for this spot" });
    }

    console.log(
      `Comments fetched successfully for spot ID ${req.params.spotId}`,
      comments
    );
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error in GET /comments/:spotId route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a spot by spotId (Protected Route)
router.put("/:spotId", authMiddleware, async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    // Ensure the user updating the spot is the owner
    if (spot.userId !== req.auth.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this spot" });
    }

    await spot.update(req.body);
    res.status(200).json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a spot by spotId (Protected Route)
router.delete("/:spotId", authMiddleware, async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    // Ensure the user deleting the spot is the owner
    if (spot.userId !== req.auth.userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this spot" });
    }

    await spot.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a spot (Protected Route)
router.post("/:spotId/like", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id; // Use req.user.id as set by authMiddleware

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Check if the user already liked this spot
    const existingLike = await Like.findOne({
      where: { userId, spotId },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this spot" });
    }

    // Create a new like entry
    await Like.create({ userId, spotId });

    // Increment the likes count in the Spot model
    const spot = await Spot.findByPk(spotId);
    spot.likes = (spot.likes || 0) + 1;
    await spot.save();

    res
      .status(201)
      .json({ message: "Spot liked successfully", likes: spot.likes });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Unlike a spot (Protected Route)
router.delete("/:spotId/unlike", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  try {
    // Find the like entry
    const like = await Like.findOne({ where: { userId, spotId } });
    if (!like) {
      return res.status(400).json({ message: "You have not liked this spot" });
    }

    // Remove the like entry
    await like.destroy();

    // Decrement the likes count in the Spot model
    const spot = await Spot.findByPk(spotId);
    spot.likes = Math.max(0, (spot.likes || 0) - 1);
    await spot.save();

    res
      .status(200)
      .json({ message: "Spot unliked successfully", likes: spot.likes });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ error: error.message });
  }
});

// Save a spot (bookmark) (Protected Route)
router.post("/:spotId/save", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  try {
    const existingSave = await SavedSpot.findOne({ where: { userId, spotId } });

    if (existingSave) {
      return res.status(400).json({ message: "Spot already saved" });
    }

    await SavedSpot.create({ userId, spotId });

    res.status(201).json({ message: "Spot saved successfully" });
  } catch (error) {
    console.error("Error saving spot:", error);
    res.status(500).json({ message: "Failed to save spot" });
  }
});

// Remove a saved spot (Protected Route)
router.delete("/:spotId/save", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  try {
    const savedSpot = await SavedSpot.findOne({ where: { userId, spotId } });

    if (!savedSpot) {
      return res.status(400).json({ message: "Spot not saved" });
    }

    await savedSpot.destroy();

    res.status(200).json({ message: "Spot removed from saved spots" });
  } catch (error) {
    console.error("Error removing saved spot:", error);
    res.status(500).json({ message: "Failed to remove saved spot" });
  }
});

module.exports = router;
