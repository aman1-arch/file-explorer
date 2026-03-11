const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://itsdemon100_db_user:YOUR_PASSWORD@cluster0.toiqp3q.mongodb.net/file-explorer?retryWrites=true&w=majority";
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/nodes', require('./routes/nodes'));

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
