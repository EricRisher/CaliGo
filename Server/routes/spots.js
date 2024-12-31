const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Spot, User, Comment, Like, SavedSpot } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const axios = require("axios");

const router = express.Router();

// Helper function to fetch city from coordinates
const fetchCityFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log(`Fetching city for coordinates: ${latitude}, ${longitude}`);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    console.log(
      "Geocoding API Response:",
      JSON.stringify(response.data, null, 2)
    );

    const city =
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name ||
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name ||
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("sublocality")
      )?.long_name;

    if (!city) {
      console.warn(
        `No city found for coordinates (${latitude}, ${longitude}).`
      );
    }

    return city || "Unknown Location";
  } catch (error) {
    console.error(
      `Error fetching city for coordinates (${latitude}, ${longitude}):`,
      error.message
    );
    return "Unknown Location";
  }
};

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

    if (!location) {
      return res.status(400).json({
        message:
          "Location is required and should be in 'latitude, longitude' format.",
      });
    }

    const [latitude, longitude] = location
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    console.log("Parsed Coordinates:", { latitude, longitude });

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: "Invalid coordinates format. Use 'latitude, longitude'.",
      });
    }

    const cityName = await fetchCityFromCoordinates(latitude, longitude);
    console.log("Fetched City:", cityName);

    const imagePath = req.file
      ? `/uploads/${req.user.id}/${req.file.filename}`
      : null;

    const newSpot = await Spot.create({
      spotName,
      description,
      location,
      latitude,
      longitude,
      city: cityName,
      image: imagePath,
      userId: req.user.id,
    });

    res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating new spot:", error.message);
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
          model: User,
          as: "UsersWhoLiked",
          attributes: ["id"],
          through: { attributes: [] },
          where: { id: userId },
          required: false,
        },
        {
          model: User,
          as: "UsersWhoSaved",
          attributes: ["id"],
          through: { attributes: [] },
          where: { id: userId },
          required: false,
        },
      ],
      order: [["id", "DESC"]],
    });

    const spotsWithStates = spots.map((spot) => ({
      ...spot.toJSON(),
      userLiked: spot.UsersWhoLiked.length > 0,
      userSaved: spot.UsersWhoSaved.length > 0,
      commentCount: spot.Comments ? spot.Comments.length : 0,
    }));

    res.status(200).json(spotsWithStates);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Failed to fetch spots" });
  }
});

// Get a spot by spotId
router.get("/:spotId", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  try {
    const spot = await Spot.findByPk(spotId, {
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
          include: [
            {
              model: User,
              as: "commentAuthor",
              attributes: ["id", "username"],
            },
          ],
        },
        {
          model: User,
          as: "UsersWhoLiked",
          attributes: ["id"],
          through: { attributes: [] },
          where: { id: userId },
          required: false,
        },
        {
          model: User,
          as: "UsersWhoSaved",
          attributes: ["id"],
          through: { attributes: [] },
          where: { id: userId },
          required: false,
        },
      ],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const spotWithStates = {
      ...spot.toJSON(),
      userLiked: spot.UsersWhoLiked.length > 0,
      userSaved: spot.UsersWhoSaved.length > 0,
      commentCount: spot.Comments ? spot.Comments.length : 0,
    };

    res.status(200).json(spotWithStates);
  } catch (error) {
    console.error("Error fetching spot:", error);
    res.status(500).json({ message: "Failed to fetch spot" });
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
  const { spotId } = req.params;
  const userId = req.user?.id;
  console.log("Authenticated user ID:", req.auth?.id); // Debugging

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("Authenticated user ID:", req.auth?.userId); // Debugging

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }

    // Ensure the user deleting the spot is the owner or an admin
    if (spot.userId !== userId) {
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

router.post("/:spotId/like", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const spotIdInt = parseInt(spotId, 10);
  if (isNaN(spotIdInt)) {
    return res.status(400).json({ message: "Invalid Spot ID" });
  }

  try {
    const spot = await Spot.findByPk(spotIdInt);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const existingLike = await Like.findOne({
      where: { userId, spotId: spotIdInt },
    });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this spot" });
    }

    await Like.create({ userId, spotId: spotIdInt });
    spot.likes = (spot.likes || 0) + 1;
    await spot.save();

    res
      .status(201)
      .json({ message: "Spot liked successfully", likes: spot.likes });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

router.post("/:spotId/save", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const spotIdInt = parseInt(spotId, 10);
  if (isNaN(spotIdInt)) {
    return res.status(400).json({ message: "Invalid Spot ID" });
  }

  try {
    const spot = await Spot.findByPk(spotIdInt);
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const existingSave = await SavedSpot.findOne({
      where: { userId, spotId: spotIdInt },
    });
    if (existingSave) {
      return res.status(400).json({ message: "Spot already saved" });
    }

    await SavedSpot.create({ userId, spotId: spotIdInt });

    res.status(201).json({
      message: "Spot saved successfully",
      userSaved: true,
    });
  } catch (error) {
    console.error("Error saving spot:", error);
    res.status(500).json({ message: "Failed to save spot" });
  }
});

// Remove a saved spot (Protected Route)
router.delete("/:spotId/unsave", authMiddleware, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const spotIdInt = parseInt(spotId, 10);
  if (isNaN(spotIdInt)) {
    return res.status(400).json({ message: "Invalid Spot ID" });
  }

  try {
    const savedSpot = await SavedSpot.findOne({
      where: { userId, spotId: spotIdInt },
    });
    if (!savedSpot) {
      return res.status(404).json({ message: "Spot not saved" });
    }

    await savedSpot.destroy();

    res.status(200).json({
      message: "Spot removed from saved spots",
      userSaved: false,
    });
  } catch (error) {
    console.error("Error removing saved spot:", error);
    res.status(500).json({ message: "Failed to remove saved spot" });
  }
});

module.exports = router;
