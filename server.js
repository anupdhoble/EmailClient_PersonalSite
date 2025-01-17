const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const logger = require('./logger');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle feedback
app.post('/feedback', (req, res) => {
    const feedback = req.body.feedback;
    const userEmail = req.body.email;

    // Send feedback to your inbox
    sendEmail('feedback@anupdhoble.tech', 'New Feedback Received', generateEmailTemplate(feedback, 'New Feedback'));

    // Send a custom message to the user
    sendEmail(userEmail, 'Thank You for Your Feedback', generateEmailTemplate('We appreciate your feedback! Stay Tuned For latest Update', 'Thank You'));

    res.json({ message: 'Feedback received, thank you!' });
});

// Create a transporter object using the non-SSL SMTP settings
const transporter = nodemailer.createTransport({
    host: 'us2.smtp.mailhostbox.com',
    port: 465, // or 587 if port 465 is not available
    secure: true, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to send an email
function sendEmail(to, subject, htmlContent) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(`Error: ${error}`);
        } else {
            logger.info(`Email sent: ${info.response}`);
        }
    });
}

// Function to generate email template with custom theme
function generateEmailTemplate(message, title) {
    return `
       <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #5cdb95;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    overflow: hidden;
                }
                .header {
                    color: #05386b;
                    padding-top: 30px;
                    min-height: 70px;
                    text-align: center;
                }
                .header h1 {
                    text-align: center;
                    text-transform: uppercase;
                    margin: 0;
                }
                .message {
                    background: #fff;
                    padding: 20px;
                    margin: 20px 0;
                }
                .footer {
                    border: solid #05386b;
                    border-radius: 5px;
                    color: #05386b;
                    text-align: center;
                    padding: 10px;
                    margin-top: 20px;
                }
                .social-links img {
                    width: 30px;
                    height: 30px;
                    margin: 0 10px;
                    vertical-align: middle;
                }
                .social-links a {
                    text-decoration: none;
                    color: #fff;
                }
                .footer p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <h1>${title}</h1>
                </header>
                <div class="message">
                    <p>${message}</p>
                </div>
                <footer class="footer">
                    <div class="social-links">
                        <a href="https://github.com/anupdhoble"><img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub"></a>
                        <a href="https://linkedin.com/in/anupdhoble"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
                        <a href="https://leetcode.com/anupdhoble"><img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="LeetCode"></a>
                        <a href="https://codechef.com/users/anupdhoble"><img src="https://www.svgrepo.com/show/305880/codechef.svg" alt="CodeChef"></a>
                    </div>
                    <p><a href="https://anupdhoble.tech" ; style="color:#05386b; text-decoration: none;">anupdhoble.tech</a></p>
                    <p>Thank you for your feedback!</p>
                </footer>
            </div>
        </body>
        </html>
    `;
}

// Start the server
app.listen(port, () => {
    logger.info('Server has started.');
    logger.info(`Server running on http://localhost:${port}`);
    console.log(`Server running on http://localhost:${port}`);
});
