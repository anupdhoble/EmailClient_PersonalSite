const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const logger = require('./logger'); // Import the logger
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle feedback
app.post('/feedback', (req, res) => {
    const feedback = req.body.feedback;
    const userEmail = req.body.email;

    if (!userEmail) {
        logger.error('Email is required');
        return res.status(400).json({ error: 'Email is required' });
    }
    
    // Log the feedback
    logger.info(`Received feedback: ${feedback}`);
    
    // Send feedback to your inbox
    sendEmail('feedback@anupdhoble.tech', 'Feedback Received', feedback);
    
    // Send a custom message to the user
    sendEmail(userEmail, 'Thank You for Your Feedback', 'We appreciate your feedback!');
    
    res.json({ message: 'Feedback received, thank you!' });
});

// Create a transporter object using the SSL SMTP settings
const transporter = nodemailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 465, // or 587 if port 465 is not available
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
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
            logger.error(`Error: ${error}`);
        } else {
            logger.info(`Email sent: ${info.response} to ${to}`);
        }
    });
}

// Start the server
app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
});
