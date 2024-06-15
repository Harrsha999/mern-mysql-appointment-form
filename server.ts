import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import path from 'path';

const app = express();
const port = 3001; // Backend runs on a different port from the frontend

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asdfghjkl@#3700', // Update with your MySQL password
    database: 'appointments'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, age, email, date, time } = req.body;
    const query = 'INSERT INTO appointments (name, age, email, date, time) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, age, email, date, time], (err, result) => {
        if (err) {
            res.status(500).send('Failed to book appointment.');
            throw err;
        }
        res.send('Appointment booked successfully!');
    });
});

// Serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
