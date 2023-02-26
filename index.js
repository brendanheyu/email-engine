const http = require('http');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: true,
    auth: {
        user: "fujifilm.testing.email@gmail.com",
        pass: "whsixdntiqmmpwpn"
    },
});

transporter.verify((error, success) => {
    if (error) console.error(error);
    console.log("Server is ready to take our messages");
});

app.post('/send-email', async (req, res) => {
    try {
        transporter.sendMail({
            from: 'fujifilm.testing.email@gmail.com',
            to: 'brendan.smith.zh@gmail.com',
            subject: 'Your first nodemail',
            html: `<div>Welcome! This is my first nodemail!</h2>`
        }, () => {
            res.status(200).send('Email sent')
        })
    } catch {
        return res.status(400).send('Email not sent')
    }
})

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${4000}`);
});