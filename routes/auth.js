const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Make sure you have this model

// GET Register page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST Register - handle registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (password !== confirmPassword) {
            return res.render('register', { 
                error: 'Passwords do not match' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { 
                error: 'User already exists with this email' 
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password // Make sure to hash this in your User model
        });

        await newUser.save();

        // Redirect to login page after successful registration
        res.redirect('/auth/login');

    } catch (error) {
        console.error(error);
        res.render('register', { 
            error: 'An error occurred during registration' 
        });
    }
});

// GET Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST Login - handle login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { 
                error: 'Invalid email or password' 
            });
        }

        // Check password (make sure to compare hashed passwords)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render('login', { 
                error: 'Invalid email or password' 
            });
        }

        // Create session
        req.session.userId = user._id;
        req.session.username = user.username;

        // Redirect to homepage after successful login
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.render('login', { 
            error: 'An error occurred during login' 
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
});

module.exports = router;