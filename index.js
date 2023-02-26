const http = require('http');
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

app.post('/send-email', async (req, res) => {
    try {
        transporter.sendMail({
            from: 'fujifilm.testing.email@gmail.com',
            to: 'brendan.smith.zh@fujifilm.com',
            subject: 'Your first nodemail',
            html: `<div>Welcome! This is my first nodemail!</div>`
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

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 587,
    secure: true,
    auth: {
        user: "fujifilm.testing.email@gmail.com",
        pass: "whsixdntiqmmpwpn"
    },
});

transporter.verify((err, success) => {
    if (error) console.log(error);
    console.log("Server is ready to take our messages");
});