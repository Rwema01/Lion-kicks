const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// GET login page
router.get('/auth/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', {
        title: 'Login - Lion Kicks',
        error: null,
        message: req.query.message || null,
        user: null
    });
});

// POST login
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'Email and password are required', user: null });
        }

        const user = await User.findOne({ email });
        if (!user) return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'User not found', user: null });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'Incorrect password', user: null });

        req.session.user = { 
            id: user._id, 
            username: user.username, 
            email: user.email,
            role: user.role 
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('auth/login', { title: 'Login - Lion Kicks', error: 'An error occurred during login', user: null });
    }
});

// GET register page
router.get('/auth/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', {
        title: 'Register - Lion Kicks',
        error: null,
        user: null
    });
});

// POST register
router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.render('auth/register', { title: 'Register - Lion Kicks', error: 'All fields are required', user: null });
        }
        if (password !== confirmPassword) {
            return res.render('auth/register', { title: 'Register - Lion Kicks', error: 'Passwords do not match', user: null });
        }
        if (password.length < 6) {
            return res.render('auth/register', { title: 'Register - Lion Kicks', error: 'Password must be at least 6 characters', user: null });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.render('auth/register', { title: 'Register - Lion Kicks', error: 'Email or username already exists', user: null });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/auth/login?message=Registration successful! Please login.');

    } catch (err) {
        console.error(err);
        res.render('auth/register', { title: 'Register - Lion Kicks', error: 'An error occurred', user: null });
    }
});

// GET logout
router.get('/auth/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
});

module.exports = router;
