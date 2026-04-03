require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check route for Railway deployment
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Database connection
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/notes_db";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    if (!process.env.MONGO_URI) {
        console.warn("TIP: Set MONGO_URI in a .env file for production use.");
    }
});
