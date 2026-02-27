// server.js

const express = require('express');
const dotenv = require('dotenv');
const roleValidationMiddleware = require('./middleware/roleValidation');
const app = express();

dotenv.config();

// Middleware for role validation
app.use(roleValidationMiddleware);

// Check environment variables
if (!process.env.PORT) {
  throw new Error('PORT environment variable is not set');
}

// Routes
app.get('/dashboard', (req, res) => {
  res.send('Dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});