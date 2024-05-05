const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

app.use(express.json());

const connectDB = require("./config/db");
mongoose.set("strictQuery", true);
try {
  connectDB();
} catch (error) {
  console.log(error);
}

// Setup routes
app.use('/api/user', require('./routes/user.routes'));
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
