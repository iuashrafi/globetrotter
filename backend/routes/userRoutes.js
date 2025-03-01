const express = require("express");
const router = express.Router();
const {
  createUser,
  updateScore,
  addUsedQuestion,
  getUserData,
  resetProgress,
} = require("../controllers/userController");

router.post("/", createUser);
router.post("/score", updateScore);
router.post("/used-question", addUsedQuestion);
router.get("/:username/data", getUserData);
router.post("/reset", resetProgress);

module.exports = router;