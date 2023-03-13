const http = require('http');
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const PubNub = require('pubnub');

const pubnub = new PubNub({
    publishKey: "pub-c-5cd156d5-5e5a-4024-8c76-19bc04abdc66",
    subscribeKey: "sub-c-c97bf4f8-11c3-41c1-990f-0a63ea4e657e",
    userId: "email-engine-server",
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

// sendFile will go here
app.get('/log', function (req, res) {
    res.sendFile(path.join(__dirname, '/src/log.html'));
});


// app.post('/send-email', async (req, res) => {
app.post('/send-email', (req, res) => {
    try {
        transporter.sendMail({
            from: 'fujifilm.testing.email@gmail.com',
            to: 'adam.lowry.ps@fujifilm.com',
            subject: 'Your first nodemail',
            html: `<h2>Hey Adam! Email from outside of the great firewall!</h2><p>First mission success, access to an external mail server. </p>`
        }, () => {
            res.status(200).send('Email sent')
            console.log('Got body:', req.body);
        })
    } catch {
        return res.status(400).send('Email not sent')
    }
})

app.post('/crap', (req, res) => {
    let data = req.body;
    res.send('Data Received: ' + JSON.stringify(data));
})

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${4000}`);
});



// add listener
const listener = {
    status: (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log("Connected");
        }
    },
    message: (messageEvent) => {
        showMessage(messageEvent.message.description);
    },
    presence: (presenceEvent) => {
        // handle presence
    }
};
pubnub.addListener(listener);

// publish message
const publishMessage = async (message) => {
    await pubnub.publish({
        channel: "hello_world",
        message: {
            title: "greeting",
            description: message,
        },
    });
}

// subscribe to a channel
pubnub.subscribe({
    channels: ["hello_world"],
});

// built-in package for reading from stdin
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.setPrompt("");
readline.prompt();
// publish after hitting return
readline.on('line', (message) => {
    publishMessage(message).then(() => {
        readline.prompt();
    });
});

const showMessage = (msg) => {
    console.log("message: " + msg);
}