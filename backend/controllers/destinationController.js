const Destination = require('../models/destination');
const User = require('../models/user');

exports.getRandomDestination = async (req, res) => {
  try {
    const { username } = req.query;
    let usedQuestionIds = [];

    // If username is provided, get used questions from database
    if (username) {
      const user = await User.findOne({ username });
      if (user) {
        usedQuestionIds = user.usedQuestions;
      }
    }

    // Convert usedQuestionIds to ObjectIds if needed
    // const usedObjectIds = usedQuestionIds.map(id => mongoose.Types.ObjectId(id));

    // Get total count of destinations excluding used ones
    const query = usedQuestionIds.length > 0 ? 
      { _id: { $nin: usedQuestionIds } } : 
      {};
    
    const count = await Destination.countDocuments(query);
    
    if (count === 0) {
      return res.status(200).json({ 
        message: 'All destinations completed', 
        gameOver: true 
      });
    }
    
    const random = Math.floor(Math.random() * count);
    
    const destination = await Destination.findOne(query).skip(random);
    
    if (!destination) {
      return res.status(404).json({ message: 'No destinations found' });
    }
    
    const questionData = {
      id: destination._id,
      clues: destination.clues,
      options: await generateOptions(destination.city)
    };
    
    res.json(questionData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getRandomDestinationForGuests = async (req, res) => {
  try {
    const { usedQuestions } = req.body;
    let usedQuestionIds = usedQuestions || [];

    // Get total count of destinations excluding used ones
    const query = usedQuestionIds.length > 0 ? 
      { _id: { $nin: usedQuestionIds } } : 
      {};
    
    const count = await Destination.countDocuments(query);
    
    if (count === 0) {
      return res.status(200).json({ 
        message: 'All destinations completed', 
        gameOver: true 
      });
    }
    
    const random = Math.floor(Math.random() * count);
    
    const destination = await Destination.findOne(query).skip(random);
    
    if (!destination) {
      return res.status(404).json({ message: 'No destinations found' });
    }
    
    const questionData = {
      id: destination._id,
      clues: destination.clues,
      options: await generateOptions(destination.city)
    };
    
    res.json(questionData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

exports.checkAnswer = async (req, res) => {
  try {
    const { id, answer, username } = req.body;
    
    if (!id || !answer) {
      return res.status(400).json({ message: 'Please provide destination ID and answer' });
    }
    
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    const isCorrect = destination.city.toLowerCase() === answer.toLowerCase();
     
    const factsArray = isCorrect ? destination.fun_fact : destination.trivia;
    const randomFact = factsArray[Math.floor(Math.random() * factsArray.length)];
    
    // If username is provided, update their used questions in the database
    if (username) {
      try {
        const user = await User.findOne({ username });
        if (user && !user.usedQuestions.includes(id)) {
          user.usedQuestions.push(id);
          await user.save();
        }
      } catch (err) {
        console.error('Error updating user used questions:', err);
        // Continue with the response anyway
      }
    }
    
    res.json({
      isCorrect,
      fact: randomFact,
      correctAnswer: destination.city,
      country: destination.country
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// The generateOptions function remains the same
async function generateOptions(correctCity) {
  try {
    // Get 3 random cities excluding the correct one
    const randomCities = await Destination.aggregate([
      { $match: { city: { $ne: correctCity } } },
      { $sample: { size: 3 } },
      { $project: { _id: 0, city: 1 } }
    ]);
    

    const options = randomCities.map(item => item.city);
    
    options.push(correctCity);
    
    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  } catch (error) {
    console.error('Error generating options:', error);
    // Return default options if there's an error
    return [correctCity, 'Paris', 'Tokyo', 'New York'];
  }
}