const express = require("express");
const router = express.Router();
const {
  getRandomDestination,
  checkAnswer,getRandomDestinationForGuests
} = require("../controllers/destinationController");

router.get("/random", getRandomDestination);
router.post("/random",getRandomDestinationForGuests);
router.post("/check-answer", checkAnswer);

module.exports = router;
