const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000; // Default to 3000 if PORT is not set

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line if you're sending JSON payloads

// Create a transporter object using the correct SMTP settings
const transporter = nodemailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 587, // Use 465 if using SSL
    secure: false, // Use true if using SSL (port 465)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint to handle feedback
app.post('/feedback', (req, res) => {
    const feedback = req.body.feedback;
    const userEmail = req.body.email;
    
    // Send feedback to your inbox
    sendEmail('feedback@anupdhoble.tech', 'Feedback Received', feedback);
    
    // Send a custom message to the user
    sendEmail(userEmail, 'Thank You for Your Feedback', 'We appreciate your feedback!');
    
    res.json({ message: 'Feedback received, thank you!' });
});

// Function to send an email
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
