const User = require("../models/user");

// Create or update user
exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(200).json(user);
    }

    user = new User({
      username,
    });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to create user, Server error", error: error.message });
  }
};

// Update user score
exports.updateScore = async (req, res) => {
  try {
    const { username, isCorrect } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update score
    if (isCorrect) {
      user.correctAnswers += 1;
    } else {
      user.incorrectAnswers += 1;
    }

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get user score
exports.getUserScore = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      correctAnswers: user.correctAnswers,
      incorrectAnswers: user.incorrectAnswers,
      totalAnswers: user.correctAnswers + user.incorrectAnswers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
