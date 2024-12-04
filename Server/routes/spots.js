const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Spot, User, Comment, Like } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Set the base upload directory on the server-side
const baseUploadPath = path.join(__dirname, "../uploads");

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
router.get("/", async (req, res) => {
  try {
    // Ensure the user ID is available
    const userId = req.user?.id;

    // Fetch all spots with related data
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
          model: User,
          as: "UsersWhoLiked",
          attributes: ["id"],
          through: { attributes: [] }, // Exclude intermediate table fields
          where: userId ? { id: userId } : undefined, // Apply filter if userId exists
          required: false, // Include even if user hasn't liked the spot
        },
      ],
      order: [["id", "DESC"]],
    });

    // Enhance spots with userLiked and commentCount fields
    const spotsWithLikeState = spots.map((spot) => {
      const jsonSpot = spot.toJSON();
      return {
        ...jsonSpot,
        userLiked:
          Array.isArray(jsonSpot.UsersWhoLiked) &&
          jsonSpot.UsersWhoLiked.length > 0,
        commentCount: jsonSpot.Comments ? jsonSpot.Comments.length : 0,
      };
    });

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
    const spotId = req.params.spotId;
    const userId = req.user.userId; // Access userId from req.auth

    console.log("Deleting spot:", { spotId, userId }); // Debugging: Log spotId and userId

    if (!userId) {
      return res.status(403).json({ error: "Unauthorized: Missing userId." });
    }

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    if (spot.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this spot" });
    }

    await spot.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error in delete route:", error); // Debugging: Log error details
    res.status(500).json({ error: error.message });
  }
});


// Like a spot (Protected Route)
router.post("/:spotId/like", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.userId; // Use req.user.id as set by authMiddleware

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

module.exports = router;
