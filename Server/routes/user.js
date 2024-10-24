const express = require("express");
const { requireAuth } = require("@clerk/express");
const User = require("../models/User");
const Spot = require("../models/Spot");

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user (Protected Route - Only the authenticated user can update their own account)
router.put("/:id", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the authenticated user is the one updating their own account
    if (req.auth.userId !== id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this user" });
    }

    const [updated] = await User.update(req.body, {
      where: { id: id },
    });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      return res.status(200).json(updatedUser);
    }

    throw new Error("User not found");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete a user (Protected Route - Only the authenticated user can delete their own account)
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the authenticated user is the one deleting their own account
    if (req.auth.userId !== id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this user" });
    }

    const deleted = await User.destroy({
      where: { id: id },
    });

    if (deleted) {
      return res.status(204).send("User deleted");
    }

    throw new Error("User not found");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all spots created by a user
router.get("/:userId/spots", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: Spot,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.Spots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all spots saved by a user (Assumes a saved spots relation exists)
router.get("/:userId/saved-spots", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: {
        model: Spot,
        as: "SavedSpots", // Ensure your Spot model has this alias for saved spots
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.SavedSpots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
