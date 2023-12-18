import express from 'express'
import mysql from 'mysql2/promise'
import cors from 'cors'
import {publishMessage} from './mqtt.js'

const app = express();
const port = 3000; // Choose a port for your server

// MySQL database configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "12345",
  database: "iot",
};

app.use(cors())
app.use(express.json())

// Create a route to retrieve data from the MySQL database
app.get('/data', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Execute a query to fetch data from the database
    const [rows, fields] = await connection.execute('SELECT * FROM data ORDER BY Date DESC');
    connection.end();

    if (Array.isArray(rows)) {
      if (rows.length > 0) {
        // Respond with the retrieved data as JSON
        res.json(rows);
      } else {
        // Handle the case when there are no results
        res.json({ message: 'No data found' });
      }
    } else {
      // Handle the case when the result is not an array
      res.status(500).json({ error: 'Unexpected data format from the database.' });
    }
  } catch (error) {
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

app.get('/action', async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
  
      // Execute a query to fetch data from the database
      const [rows, fields] = await connection.execute('SELECT * FROM action ORDER BY Date DESC');
      connection.end();
  
      if (Array.isArray(rows)) {
          if (rows.length > 0) {
            // Respond with the retrieved data as JSON
            res.json(rows);
          } else {
            // Handle the case when there are no results
            res.json({ message: 'No data found' });
          }
        } else {
          // Handle the case when the result is not an array
          res.status(500).json({ error: 'Unexpected data format from the database.' });
        }
    } catch (error) {
      console.error('Error fetching data from MySQL:', error);
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.post('/login', async (req, res) =>{
  const {username, password} = req.body;
  try{
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? and password = ?', [username, password]);
    if (rows.length > 0) {
      console.log("login success");
      // Đăng nhập thành công
      return res.status(200).json({ message: 'Login successful', user: rows[0] });
    } else {
      // Sai thông tin đăng nhập
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

  }catch(error){
    console.error('Error fetching data from MySQL:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

// Create a route to insert data into the "data" table
app.post('/action', async (req, res) => {
  try {
    console.log(req.body)
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { item, value } = req.body
    let state
    const connection = await mysql.createConnection(dbConfig);
    if (value) {
        state = 'ON'
    } else {
        state = 'OFF'
    }
    publishMessage(item, state);
    // Insert data into the MySQL database
    await connection.execute(
      'INSERT INTO action (Date, device, value) VALUES (?, ?, ?)',
      [date, item, state]
    );

    connection.end();

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data into MySQL:', error);
    res.status(500).json({ error: 'An error occurred while inserting data.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
