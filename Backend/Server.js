const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
  database: "eventplanning", 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("connected to MySQL Database");
});



// Route for save event data to the datanase
app.post("/events", (req, res) => {
  const { event_name, description, event_date, event_time, venue, ticketprice } = req.body;

  // Validate incoming data
  if (!event_name || !description || !event_date || !event_time || !venue || !ticketprice) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = "INSERT INTO event (event_name, description, event_date, event_time, venue, ticketprice) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.query(query, [event_name, description, event_date, event_time, venue, ticketprice], (error, results) => {
    if (error) {
      console.error("Error saving event:", error);
      return res.status(400).json({ message: "Failed to save event", error: error.message });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// Route for show event data in the table of the frontend
app.get("/event", (req, res) => {
    const query = "SELECT * FROM event";
    
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error fetching events:", error);
        return res.status(500).json({ message: "Failed to fetch events", error: error.message });
      }
      res.json(results);
    });
  });


  
// Route to Register a customer
app.post('/register', async (req, res) => {
  const { nic, name, contactNo, email, password } = req.body;

  // Check if the NIC or Email already exists
  const query = 'SELECT * FROM customer WHERE nic = ? OR email = ?';
  db.query(query, [nic, email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.length > 0) {
      // NIC or Email already exists
      const existingUser = result[0];
      if (existingUser.nic === nic) {
        return res.status(400).json({ error: 'NIC already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    } else {
      // Hash the password and insert into the database
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO customer (nic, name, contact_number, email, password) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [nic, name, contactNo, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        // Respond with user details upon successful registration
        res.status(201).json({ 
          message: 'User registered successfully', 
          user: { nic, name, email } // Include NIC and name in the response
        });
      });
    }
  });
});

// Route to Login a user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists with the given email
  const query = 'SELECT * FROM customer WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (result.length === 0) {
      // No user with this email
      return res.status(400).json({ error: 'Email or password is incorrect' });
    }

    const user = result[0];

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Email or password is incorrect' });
    }

    // If the email and password match, respond with user details
    res.status(200).json({ 
      message: 'Login successful', 
      user: { nic: user.nic, name: user.name, email: user.email } // Include NIC and name in the response
    });
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
