const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Spot, User, Comment, SpotLike } = require("../models/Index");
const { requireAuth } = require("@clerk/express"); // Clerk's authentication middleware

const router = express.Router();

// Create the upload path if it doesn't exist
const uploadPath = path.resolve(__dirname, "../client/public/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Upload path:", uploadPath); // Debugging
    cb(null, uploadPath); // Ensure the path exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Create a new spot (Protected Route)
router.post("/", requireAuth(), upload.single("image"), async (req, res) => {
  try {
    const { spotName, spotDescription, spotLocation } = req.body;

    const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const newSpot = await Spot.create({
      spotName,
      description: spotDescription,
      location: spotLocation,
      image: imagePath,
      userId: req.auth.userId, // Clerk's authenticated user ID
    });

    res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating new spot:", error);
    res.status(500).json({ error: "Failed to add the spot" });
  }
});

// Get all spots
router.get("/", async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
      ],
    });
    res.status(200).json(spots);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get a spot by spotId
router.get("/:spotId", async (req, res) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password"] },
        },
        {
          model: Comment,
        },
      ],
    });
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    res.status(200).json(spot);
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update a spot by spotId (Protected Route)
router.put("/:spotId", requireAuth(), async (req, res) => {
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
router.delete("/:spotId", requireAuth(), async (req, res) => {
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
router.post("/:spotId/like", requireAuth(), async (req, res) => {
  const { spotId } = req.params;

  try {
    // Check if the user already liked this spot
    const existingLike = await SpotLike.findOne({
      where: { userId: req.auth.userId, spotId },
    });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this spot" });
    }

    // Create a new like entry
    await SpotLike.create({ userId: req.auth.userId, spotId });

    // Optionally, increment the likes count in the Spot model
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
router.delete("/:spotId/unlike", requireAuth(), async (req, res) => {
  const { spotId } = req.params;

  try {
    // Find the like entry
    const like = await SpotLike.findOne({
      where: { userId: req.auth.userId, spotId },
    });
    if (!like) {
      return res.status(400).json({ message: "You have not liked this spot" });
    }

    // Remove the like entry
    await like.destroy();

    // Optionally, decrement the likes count in the Spot model
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
