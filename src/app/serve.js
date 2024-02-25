// server.js

const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// กำหนดการเชื่อมต่อกับ MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'adv.web'
});

// เชื่อมต่อกับ MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ตั้งค่า Middleware เพื่อรับ JSON
app.use(express.json());

// Allow requests from localhost:4200
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// สร้างเส้นทาง GET สำหรับดึงข้อมูลจาก MySQL
app.get('/api/mysql-data', (req, res) => {
  const query = 'SELECT * FROM user';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching MySQL data:', error);
      res.status(500).json({ error: 'Error fetching MySQL data' });
    } else {
      res.json(results);
    }
  });
});

// สร้างเส้นทาง POST สำหรับบันทึกข้อมูลลงใน MySQL
app.post('/api/save-to-mysql', (req, res) => {
  const dataToSave = req.body;

  const query = 'INSERT INTO user SET ?';

  connection.query(query, dataToSave, (error, results) => {
    if (error) {
      console.error('Error saving data to MySQL:', error);
      res.status(500).json({ error: 'Error saving data to MySQL' });
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/api/login', (req, res) => {
    const {email, password } = req.body;
  
    // Perform authentication logic with your MySQL database
    const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, results) => {
      if (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login' });
      } else {
        if (results.length > 0) {
          // User authenticated successfully
          res.json({ success: true, user: results[0] });
        } else {
          // Invalid credentials
          res.status(401).json({ error: 'Invalid credentials' });
        }
      }
    });
  });


  app.post('/api/register', (req, res) => {
    const { username, password,email } = req.body;

     // Check if the email follows a valid format
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!emailRegex.test(email)) {
         return res.status(400).json({ error: 'Invalid email format' });
     }
  
    // Perform authentication logic with your MySQL database
    const query = 'INSERT INTO user (username, password,email) VALUES (?, ?,?)';
    connection.query(query, [username, password,email], (error, results) => {
        if (error) {
            console.error('Error during registration:', error);
            res.status(500).json({ error: 'Error during registration' });
        } else {
            // Registration successful
            res.status(201).json({ success: true, user: results });
        }
    });
  });

//   app.post('/api/register', (req, res) => {
//     const { username, password } = req.body;
  
//     // Perform registration logic with your MySQL database
//     const query = 'INSERT INTO user (username, password) VALUES (?, ?)';
//     connection.query(query, [username, password], (error, results) => {
//         if (error) {
//             console.error('Error during registration:', error);
//             res.status(500).json({ error: 'Error during registration' });
//         } else {
//             // Registration successful
//             res.status(201).json({ success: true, user: results });
//         }
//     });
// });


// เริ่มต้น Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
