const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Channel = require("../models/Channel");

// Create Channel
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const channel = await Channel.create({
      name,
      createdBy: req.user.id
    });

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: "Error creating channel" });
  }
});

// Get All Channels
router.get("/", auth, async (req, res) => {
  const channels = await Channel.find();
  res.json(channels);
});

module.exports = router;
