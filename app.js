const express = require('express');
const dbPool = require('./database/connect');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the PostgreSQL and Express.js application!');
});

// Endpoint to fetch all users from the  table
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

//endpoint to add a new user to the  table
app.post('/users', async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    const result = await dbPool.query(
      `INSERT INTO ${process.env.TABLE_NAME} (full_name, email, password) VALUES ($1, $2, $3) RETURNING full_name, email`,
      [full_name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ 
        success: false,
        error: 'Internal Server Error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});