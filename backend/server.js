const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.get('/', (req, res) => {
  res.send('Hello world from Imtiaz uddin');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});