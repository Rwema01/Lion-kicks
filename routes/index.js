const express = require('express');
const router = express.Router();

// Homepage route - protected
router.get('/', (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    
    res.render('homepage', {
        username: req.session.username
    });
});

// Add other public routes here (about, contact, etc.)
router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;