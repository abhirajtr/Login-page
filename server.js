const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs'); // Require EJS

const app = express();
const port = 3000;

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true
}));

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

const predefinedUsername = 'user';
const predefinedPassword = '123';

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Login route
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Authenticate route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === predefinedUsername && password === predefinedPassword) {
        req.session.authenticated = true;
        req.session.username = username; // Store the username in the session
        res.redirect('/home');
    } else {
        res.send('Incorrect username or password. <a href="/login">Try again</a>');
    }
});

// Home route
app.get('/home', authenticateUser, (req, res) => {
    const username = req.session.username;
    res.render('home', { username }); // Use res.render instead of res.sendFile
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});