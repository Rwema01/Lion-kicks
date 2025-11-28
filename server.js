const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'lion-kicks-rwanda-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------------------
// DATA STORAGE (In-Memory for now)
// ---------------------------
const exchangeRate = 1250;
const shoes = [
    // Kids (8)
    { id: 1, name: 'Low-Top Skate Sneaker (grey and white)', category: 'Sneakers', gender: 'Kids', priceUSD: 10, priceFRW: 10 * exchangeRate, image: '/images/kids1.png', sizes: '28-38', quantity: 20, material: 'Canvas' },
    { id: 2, name: 'Chukka Suede Boot', category: 'Sneakers', gender: 'Kids', priceUSD: 12, priceFRW: 12 * exchangeRate, image: '/images/kids2.png', sizes: '28-38', quantity: 15, material: 'Suede' },
    { id: 3, name: 'Slip-On Canvas Shoe', category: 'Casual', gender: 'Kids', priceUSD: 8, priceFRW: 8 * exchangeRate, image: '/images/kids3.png', sizes: '28-38', quantity: 10, material: 'Canvas' },
    { id: 4, name: 'Rugged Ankle Boot', category: 'Casual', gender: 'Kids', priceUSD: 9, priceFRW: 9 * exchangeRate, image: '/images/kids4.png', sizes: '28-38', quantity: 8, material: 'Leather' },
    { id: 5, name: 'Mary Jane Shoe', category: 'Boots', gender: 'Kids', priceUSD: 15, priceFRW: 15 * exchangeRate, image: '/images/kids5.png', sizes: '28-38', quantity: 12, material: 'Leather' },
    { id: 6, name: 'Faux-Fur Winter Boot', category: 'Boots', gender: 'Kids', priceUSD: 16, priceFRW: 16 * exchangeRate, image: '/images/kids6.png', sizes: '28-38', quantity: 9, material: 'Synthetic' },
    { id: 7, name: 'Sporty Adjustable-Strap Sandal', category: 'Formal', gender: 'Kids', priceUSD: 18, priceFRW: 18 * exchangeRate, image: '/images/kids7.png', sizes: '28-38', quantity: 5, material: 'Rubber' },
    { id: 8, name: 'T-Strap Dress Shoe (white)', category: 'Formal', gender: 'Kids', priceUSD: 20, priceFRW: 20 * exchangeRate, image: '/images/kids8.png', sizes: '28-38', quantity: 7, material: 'Leather' },

    // Men (8)
    { id: 9, name: 'Athletic Sneaker', category: 'Sneakers', gender: 'Men', priceUSD: 25, priceFRW: 25 * exchangeRate, image: '/images/men1.png', sizes: '40-45', quantity: 20, material: 'Mesh' },
    { id: 10, name: 'Chelsea Boot (Tan Leather)', category: 'Sneakers', gender: 'Men', priceUSD: 28, priceFRW: 28 * exchangeRate, image: '/images/men2.png', sizes: '40-45', quantity: 12, material: 'Leather' },
    { id: 11, name: 'Footbed Sandal', category: 'Casual', gender: 'Men', priceUSD: 18, priceFRW: 18 * exchangeRate, image: '/images/men3.jpg', sizes: '40-45', quantity: 15, material: 'Rubber' },
    { id: 12, name: 'Bit Loafer / Suede Moccasin', category: 'Casual', gender: 'Men', priceUSD: 20, priceFRW: 20 * exchangeRate, image: '/images/men4.png', sizes: '40-45', quantity: 10, material: 'Suede' },
    { id: 13, name: 'Chelsea Boot (Brown Leather)', category: 'Boots', gender: 'Men', priceUSD: 30, priceFRW: 30 * exchangeRate, image: '/images/men5.png', sizes: '40-45', quantity: 8, material: 'Leather' },
    { id: 14, name: 'Combat / Lace-up Work Boot (Black)', category: 'Boots', gender: 'Men', priceUSD: 32, priceFRW: 32 * exchangeRate, image: '/images/men6.png', sizes: '40-45', quantity: 6, material: 'Leather' },
    { id: 15, name: 'Oxford / Derby Dress Shoe (Black)', category: 'Formal', gender: 'Men', priceUSD: 35, priceFRW: 35 * exchangeRate, image: '/images/men7.jpg', sizes: '40-45', quantity: 5, material: 'Leather' },
    { id: 16, name: 'Low-top Leather Sneaker (White)', category: 'Formal', gender: 'Men', priceUSD: 38, priceFRW: 38 * exchangeRate, image: '/images/men8.png', sizes: '40-45', quantity: 7, material: 'Leather' },

    // Women (8)
    { id: 17, name: 'Classic Red Stiletto Pumps', category: 'Sneakers', gender: 'Women', priceUSD: 22, priceFRW: 22 * exchangeRate, image: '/images/women1.png', sizes: '36-41', quantity: 15, material: 'Synthetic' },
    { id: 18, name: 'Brown Harness Ankle Boots', category: 'Sneakers', gender: 'Women', priceUSD: 24, priceFRW: 24 * exchangeRate, image: '/images/women2.png', sizes: '36-41', quantity: 12, material: 'Leather' },
    { id: 19, name: 'Faux-Fur Lined Ankle Boots', category: 'Casual', gender: 'Women', priceUSD: 18, priceFRW: 18 * exchangeRate, image: '/images/women3.png', sizes: '36-41', quantity: 10, material: 'Synthetic' },
    { id: 20, name: 'Lightweight Running Trainers', category: 'Casual', gender: 'Women', priceUSD: 20, priceFRW: 20 * exchangeRate, image: '/images/women4.png', sizes: '36-41', quantity: 8, material: 'Mesh' },
    { id: 21, name: 'Suede Moccasin Loafers', category: 'Boots', gender: 'Women', priceUSD: 28, priceFRW: 28 * exchangeRate, image: '/images/women5.png', sizes: '36-41', quantity: 6, material: 'Suede' },
    { id: 22, name: 'Black Woven Ballet Flats', category: 'Boots', gender: 'Women', priceUSD: 30, priceFRW: 30 * exchangeRate, image: '/images/women6.png', sizes: '36-41', quantity: 9, material: 'Leather' },
    { id: 23, name: 'Leather Slide Sandals', category: 'Formal', gender: 'Women', priceUSD: 32, priceFRW: 32 * exchangeRate, image: '/images/women7.png', sizes: '36-41', quantity: 7, material: 'Leather' },
    { id: 24, name: 'Low-Top Retro Casual Sneakers', category: 'Formal', gender: 'Women', priceUSD: 35, priceFRW: 35 * exchangeRate, image: '/images/women8.png', sizes: '36-41', quantity: 5, material: 'Canvas' }
];

const users = [];
const orders = [];

// ---------------------------
// ROUTES
// ---------------------------

// HOME
app.get('/', (req, res) => {
    // Get 4 shoes from each category
    const kidsShoes = shoes.filter(shoe => shoe.gender === 'Kids').slice(0, 4);
    const menShoes = shoes.filter(shoe => shoe.gender === 'Men').slice(0, 4);
    const womenShoes = shoes.filter(shoe => shoe.gender === 'Women').slice(0, 4);

    // Combine all featured shoes
    const featuredShoes = [...kidsShoes, ...menShoes, ...womenShoes];

    res.render('index', {
        title: 'Lion Kicks - Buy Quality Shoes in Rwanda',
        user: req.session.user || null,
        shoes: featuredShoes
    });
});

// ABOUT
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us - Lion Kicks',
        user: req.session.user || null
    });
});

// CONTACT
app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact Us - Lion Kicks',
        user: req.session.user || null
    });
});

// PROFILE
app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');

    // Get user's orders
    const userOrders = orders.filter(order => order.userId === req.session.user.id);

    res.render('profile', {
        title: 'My Profile - Lion Kicks',
        user: req.session.user,
        orders: userOrders
    });
});

// SHOP ROUTES
app.get('/shop', (req, res) => {
    res.render('shop/index', {
        title: 'Shop All Shoes - Lion Kicks',
        shoes,
        user: req.session.user || null
    });
});

app.get('/shop/men', (req, res) => {
    const menShoes = shoes.filter(shoe => shoe.gender === 'Men');
    res.render('shop/men', {
        title: 'Men Shoes - Lion Kicks',
        shoes: menShoes,
        user: req.session.user || null
    });
});

app.get('/shop/women', (req, res) => {
    const womenShoes = shoes.filter(shoe => shoe.gender === 'Women');
    res.render('shop/women', {
        title: 'Women Shoes - Lion Kicks',
        shoes: womenShoes,
        user: req.session.user || null
    });
});

app.get('/shop/kids', (req, res) => {
    const kidsShoes = shoes.filter(shoe => shoe.gender === 'Kids');
    res.render('shop/kids', {
        title: 'Kids Shoes - Lion Kicks',
        shoes: kidsShoes,
        user: req.session.user || null
    });
});

// SHOE DETAIL
app.get('/shop/:id', (req, res) => {
    const shoeId = parseInt(req.params.id);
    const shoe = shoes.find(s => s.id === shoeId);
    if (!shoe) return res.status(404).render('404', {
        title: 'Shoe Not Found - Lion Kicks',
        user: req.session.user || null
    });
    res.render('shop/detail', {
        title: `${shoe.name} - Lion Kicks`,
        shoe,
        user: req.session.user || null
    });
});

// AUTH ROUTES
app.get('/auth/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', {
        title: 'Login - Lion Kicks',
        error: null,
        message: req.query.message || null, // Add this line to handle success message
        user: null
    });
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('auth/login', {
                title: 'Login - Lion Kicks',
                error: 'Email and password are required',
                user: null
            });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.render('auth/login', {
                title: 'Login - Lion Kicks',
                error: 'User not found',
                user: null
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('auth/login', {
                title: 'Login - Lion Kicks',
                error: 'Incorrect password',
                user: null
            });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        res.redirect('/');
    } catch (error) {
        res.render('auth/login', {
            title: 'Login - Lion Kicks',
            error: 'An error occurred during login',
            user: null
        });
    }
});

app.get('/auth/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', {
        title: 'Register - Lion Kicks',
        error: null,
        user: null
    });
});

app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            return res.render('auth/register', {
                title: 'Register - Lion Kicks',
                error: 'All fields are required',
                user: null
            });
        }

        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Register - Lion Kicks',
                error: 'Passwords do not match',
                user: null
            });
        }

        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Register - Lion Kicks',
                error: 'Password must be at least 6 characters',
                user: null
            });
        }

        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register - Lion Kicks',
                error: 'Email or username already exists',
                user: null
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        users.push(newUser);

        // REMOVED: Automatic login after registration
        // req.session.user = { 
        //     id: newUser.id, 
        //     username: newUser.username, 
        //     email: newUser.email 
        // };

        // NEW: Redirect to login page with success message
        res.redirect('/auth/login?message=Registration successful! Please login to your account.');

    } catch (error) {
        res.render('auth/register', {
            title: 'Register - Lion Kicks',
            error: 'An error occurred during registration',
            user: null
        });
    }
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
});

// API ROUTES
app.get('/api/shoes', (req, res) => res.json(shoes));
app.get('/api/shoes/:id', (req, res) => {
    const shoe = shoes.find(s => s.id === parseInt(req.params.id));
    shoe ? res.json(shoe) : res.status(404).json({ error: 'Shoe not found' });
});

// BUY NOW ROUTES
app.get('/buy/:id', (req, res) => {
    const shoeId = parseInt(req.params.id);
    const shoe = shoes.find(s => s.id === shoeId);

    if (!shoe) {
        return res.status(404).render('404', {
            title: 'Shoe Not Found - Lion Kicks',
            user: req.session.user || null
        });
    }

    // Calculate fees
    const deliveryFeeUSD = 5; // $5 delivery fee
    const deliveryFeeFRW = deliveryFeeUSD * exchangeRate;
    const taxRate = 0.18; // 18% tax
    const taxUSD = (shoe.priceUSD * taxRate);
    const taxFRW = (shoe.priceFRW * taxRate);
    const totalUSD = shoe.priceUSD + deliveryFeeUSD + taxUSD;
    const totalFRW = shoe.priceFRW + deliveryFeeFRW + taxFRW;

    res.render('buy', {
        title: `Buy ${shoe.name} - Lion Kicks`,
        user: req.session.user || null,
        shoe: shoe,
        deliveryFeeUSD: deliveryFeeUSD,
        deliveryFeeFRW: deliveryFeeFRW,
        taxUSD: taxUSD,
        taxFRW: taxFRW,
        totalUSD: totalUSD,
        totalFRW: totalFRW
    });
});

// PROCESS PURCHASE
app.post('/purchase/:id', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please login to make a purchase' });
    }

    const shoeId = parseInt(req.params.id);
    const shoe = shoes.find(s => s.id === shoeId);

    if (!shoe) {
        return res.status(404).json({ error: 'Shoe not found' });
    }

    if (shoe.quantity === 0) {
        return res.status(400).json({ error: 'Sorry, this shoe is out of stock' });
    }

    // Calculate total
    const deliveryFeeUSD = 5;
    const taxRate = 0.18;
    const taxUSD = (shoe.priceUSD * taxRate);
    const totalUSD = shoe.priceUSD + deliveryFeeUSD + taxUSD;
    const totalFRW = totalUSD * exchangeRate;

    const orderNumber = 'LK' + Date.now();

    // Create order
    const order = {
        orderNumber: orderNumber,
        userId: req.session.user.id,
        shoeId: shoe.id,
        shoeDetails: shoe,
        totalUSD: totalUSD,
        totalFRW: totalFRW,
        deliveryAddress: req.body.address || {},
        status: 'completed',
        createdAt: new Date()
    };
    orders.push(order);

    // Update shoe quantity
    shoe.quantity -= 1;

    res.json({
        success: true,
        orderNumber: orderNumber,
        message: 'Purchase successful! Your order has been placed.'
    });
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found - Lion Kicks',
        user: req.session.user || null
    });
});

// START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🦁 Lion Kicks running on http://localhost:${PORT}`);
    console.log(`📊 Using In-Memory Storage (MongoDB not connected)`);
});