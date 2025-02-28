const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');


dotenv.config({ path: '../.env' });


const Destination = require('../models/destination');


mongoose.connect('mongodb://localhost:27017/globetrotter', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});


const jsonData = fs.readFileSync(
  path.join(__dirname, '../data/destinations.json'), 
  'utf8'
);
const destinations = JSON.parse(jsonData);


const seedDatabase = async () => {
  try {
    await Destination.deleteMany({});
    console.log('Previous data deleted');
    
    const result = await Destination.insertMany(destinations);
    console.log(`${result.length} destinations inserted successfully!`);
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();