const Destination = require('../models/destination');

exports.getRandomDestination = async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    
    const random = Math.floor(Math.random() * count);
    
    const destination = await Destination.findOne().skip(random);
    
    if (!destination) {
      return res.status(404).json({ message: 'No destinations found' });
    }
    
     const questionData = {
      id: destination._id,
      clues: destination.clues,
      // Generate 3 random incorrect options
      options: await generateOptions(destination.city)
    };
    
    res.json(questionData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.checkAnswer = async (req, res) => {
  try {
    const { id, answer } = req.body;
    
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