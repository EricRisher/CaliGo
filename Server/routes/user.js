const express = require("express");
const User = require("../models/User");
const Spot = require("../models/Spot");

const router = express.Router();

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
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

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by id
router.get("/users/:id", async (req, res) => {
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
router.get("/users/:userId/spots", async (req, res) => {
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

// Get all spots saved by a user
router.get("/users/:userId/saved-spots", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: {
        model: Spot,
        as: "SavedSpots",
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