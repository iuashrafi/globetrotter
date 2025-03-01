const express = require('express');
const router = express.Router();
const { 
  createUser, 
  updateScore, 
  getUserScore 
} = require('../controllers/userController');

// Create user
router.post('/', createUser);

// Update score
router.post('/score', updateScore);

// Get user score
router.get('/:username/score', getUserScore);

module.exports = router;