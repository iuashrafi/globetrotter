const User = require("../models/user");


exports.createUser = async (req, res) => {
  try {
    const { username, localScore, usedQuestions } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    let user = await User.findOne({ username });
    
    if (user) {
      user.lastLogin = Date.now(); // not required => remove later
      await user.save();
      return res.status(200).json(user);
    }

    user = new User({
      username,
      correctAnswers: localScore?.correct || 0,
      incorrectAnswers: localScore?.incorrect || 0,
      usedQuestions: usedQuestions || [],
      lastLogin: Date.now()
    });
    
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to create user, Server error", error: error.message });
  }
};


exports.updateScore = async (req, res) => {
  try {
    const { username, isCorrect } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

exports.addUsedQuestion = async (req, res) => {
  try {
    const { username, questionId } = req.body;

    if (!username || !questionId) {
      return res.status(400).json({ message: "Please provide username and question ID" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.usedQuestions.includes(questionId)) {
      user.usedQuestions.push(questionId);
      await user.save();
    }

    res.json({ success: true, usedQuestions: user.usedQuestions });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      correctAnswers: user.correctAnswers,
      incorrectAnswers: user.incorrectAnswers,
      totalAnswers: user.correctAnswers + user.incorrectAnswers,
      usedQuestions: user.usedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.resetProgress = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset progress
    user.correctAnswers = 0;
    user.incorrectAnswers = 0;
    user.usedQuestions = [];
    
    await user.save();

    res.json({ success: true, message: "Progress reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getUserScore = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }

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

