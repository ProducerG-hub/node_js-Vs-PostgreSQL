const express = require('express');
const dbPool = require('./database/connect');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the PostgreSQL and Express.js application!');
});

// Endpoint to fetch all users from the "members" table
app.get('/users', async (req, res) => {
  try {
    const result = await dbPool.query(`SELECT * FROM ${process.env.TABLE_NAME}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
        success: false,
        error: 'Internal Server Error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});