const express = require('express');
const router = express.Router();
const { 
  getRandomDestination, 
  checkAnswer, 
} = require('../controllers/destinationController');

router.get('/random', getRandomDestination);
router.post('/check-answer', checkAnswer);

module.exports = router;