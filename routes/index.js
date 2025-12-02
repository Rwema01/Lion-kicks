// routes/index.js
const express = require('express');
const router = express.Router();

// Middleware to check login
function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
}

// Example shoes data
const shoesArray = [
    { id: 1, name: 'Air Jordan', priceUSD: 200, priceFRW: 280000, category: 'Men', quantity: 10, image: '/images/air-jordan.jpg', sizes: [8,9,10], material: 'Leather' },
    { id: 2, name: 'Nike Air Max', priceUSD: 150, priceFRW: 210000, category: 'Women', quantity: 5, image: '/images/nike-air-max.jpg', sizes: [6,7,8], material: 'Mesh' },
    // add more shoes here
];

// Homepage (User Dashboard)
router.get('/', requireLogin, (req, res) => {
    res.render('homepage', {
        user: req.session.user
    });
});

// About page (public)
router.get('/about', (req, res) => {
    res.render('about', {
        user: req.session.user || null
    });
});

// Contact page (public)
router.get('/contact', (req, res) => {
    res.render('contact', {
        user: req.session.user || null
    });
});

// Shop page (public or login-based, depending on your preference)
router.get('/shop', (req, res) => {
    res.render('shop', {
        shoes: shoesArray,
        user: req.session.user || null
    });
});

module.exports = router;

