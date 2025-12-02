const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Shoe = require('./models/Shoe');
const Order = require('./models/Order');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
    secret: 'lion-kicks-rwanda-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Add at the TOP of server.js
require('dotenv').config();
console.log('Environment check:', {
  MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
  NODE_ENV: process.env.NODE_ENV
});

// Update your mongoose.connect
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('❌ ERROR: MONGO_URI environment variable is not set!');
  console.error('   Add MONGO_URI to Render environment variables');
}

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 15000, // Increase timeout
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('🦁 Connected to MongoDB Atlas');
  initializeDatabase();
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Check MONGO_URI in Render environment variables');
});

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In server.js, update MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lionkicks', {
    // Remove deprecated options
})
.then(() => {
    console.log('🦁 Connected to MongoDB');
    initializeDatabase();
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit if no DB connection
});

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Exchange rate
const exchangeRate = 1250;

// Function to initialize database with sample shoes
async function initializeDatabase() {
    try {
        const count = await Shoe.countDocuments();
        if (count === 0) {
            const sampleShoes = [
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
            await Shoe.insertMany(sampleShoes);
            console.log('✅ Sample shoes added to database');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// ---------------------------
// ROUTES
// ---------------------------

// HOME
app.get('/', async (req, res) => {
    try {
        // Get featured shoes from MongoDB
        const featuredShoes = await Shoe.find().limit(12).sort({ id: 1 });
        
        res.render('index', {
            title: 'Lion Kicks - Buy Quality Shoes in Rwanda',
            user: req.session.user || null,
            shoes: featuredShoes
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        res.status(500).send('Server Error');
    }
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
app.get('/profile', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');

    try {
        // Get user's orders from MongoDB
        const userOrders = await Order.find({ user: req.session.user.id })
            .populate('shoe')
            .sort({ createdAt: -1 });

        res.render('profile', {
            title: 'My Profile - Lion Kicks',
            user: req.session.user,
            orders: userOrders
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).send('Server Error');
    }
});

// ---------------------------
// PROFILE UPDATE ROUTES
// ---------------------------
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Please login first' });
    }
    next();
}

// Update username
app.post('/profile/update-username', requireAuth, async (req, res) => {
    try {
        const { newUsername } = req.body;
        
        if (!newUsername || newUsername.trim() === '') {
            return res.status(400).json({ message: 'Username is required' });
        }
        
        if (newUsername.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        
        // Check if username already exists (excluding current user)
        const existingUser = await User.findOne({ 
            username: newUsername,
            _id: { $ne: req.session.user.id }
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        
        // Update user in database
        const updatedUser = await User.findByIdAndUpdate(
            req.session.user.id,
            { username: newUsername },
            { new: true }
        );
        
        // Update session
        req.session.user.username = newUsername;
        
        res.json({ 
            success: true, 
            message: 'Username updated successfully',
            newUsername: newUsername
        });
        
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Server error updating username' });
    }
});

// Update password
app.post('/profile/update-password', requireAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'All password fields are required' });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }
        
        // Get current user from database
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update password in database
        await User.findByIdAndUpdate(
            req.session.user.id,
            { password: hashedPassword }
        );
        
        res.json({ 
            success: true, 
            message: 'Password updated successfully' 
        });
        
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error updating password' });
    }
});

// SHOP ROUTES
app.get('/shop', async (req, res) => {
    try {
        const allShoes = await Shoe.find().sort({ id: 1 });
        res.render('shop/index', {
            title: 'Shop All Shoes - Lion Kicks',
            shoes: allShoes,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error loading shop:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/shop/men', async (req, res) => {
    try {
        const menShoes = await Shoe.find({ gender: 'Men' }).sort({ id: 1 });
        res.render('shop/men', {
            title: 'Men Shoes - Lion Kicks',
            shoes: menShoes,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error loading men shoes:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/shop/women', async (req, res) => {
    try {
        const womenShoes = await Shoe.find({ gender: 'Women' }).sort({ id: 1 });
        res.render('shop/women', {
            title: 'Women Shoes - Lion Kicks',
            shoes: womenShoes,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error loading women shoes:', error);
        res.status(500).send('Server Error');
    }
});

app.get('/shop/kids', async (req, res) => {
    try {
        const kidsShoes = await Shoe.find({ gender: 'Kids' }).sort({ id: 1 });
        res.render('shop/kids', {
            title: 'Kids Shoes - Lion Kicks',
            shoes: kidsShoes,
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error loading kids shoes:', error);
        res.status(500).send('Server Error');
    }
});

// AUTH ROUTES
app.get('/auth/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', {
        title: 'Login - Lion Kicks',
        error: null,
        message: req.query.message || null,
        user: null
    });
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'Email and password are required', user: null });
        }

        const user = await User.findOne({ email });
        if (!user) return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'User not found', user: null });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('auth/login', { title: 'Login - Lion Kicks', error: 'Incorrect password', user: null });

        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('auth/login', { title: 'Login - Lion Kicks', error: 'An error occurred during login', user: null });
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

app.get('/auth/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
});

// API ROUTES
app.get('/api/shoes', async (req, res) => {
    try {
        const shoes = await Shoe.find().sort({ id: 1 });
        res.json(shoes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/shoes/:id', async (req, res) => {
    try {
        const shoeId = parseInt(req.params.id);
        const shoe = await Shoe.findOne({ id: shoeId });
        shoe ? res.json(shoe) : res.status(404).json({ error: 'Shoe not found' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// BUY NOW ROUTE
app.get('/buy/:id', async (req, res) => {
    try {
        const shoeId = parseInt(req.params.id);
        const shoe = await Shoe.findOne({ id: shoeId });

        if (!shoe) {
            return res.status(404).render('404', {
                title: 'Shoe Not Found - Lion Kicks',
                user: req.session.user || null
            });
        }

        // Calculate fees
        const exchangeRate = 1250;
        const deliveryFeeUSD = 5;
        const deliveryFeeFRW = deliveryFeeUSD * exchangeRate;
        const taxRate = 0.18;
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
    } catch (error) {
        console.error('Error loading buy page:', error);
        res.status(500).send('Server Error');
    }
});

// PROCESS PURCHASE
app.post('/purchase/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Please login to make a purchase' });
    }

    try {
        const shoeId = parseInt(req.params.id);
        const shoe = await Shoe.findOne({ id: shoeId });

        if (!shoe) {
            return res.status(404).json({ error: 'Shoe not found' });
        }

        if (shoe.quantity <= 0) {
            return res.status(400).json({ error: 'Sorry, this shoe is out of stock' });
        }

        // Calculate total
        const exchangeRate = 1250;
        const deliveryFeeUSD = 5;
        const taxRate = 0.18;
        const taxUSD = (shoe.priceUSD * taxRate);
        const totalUSD = shoe.priceUSD + deliveryFeeUSD + taxUSD;
        const totalFRW = totalUSD * exchangeRate;

        const orderNumber = 'LK' + Date.now();

        // Create order in MongoDB
        const order = new Order({
            orderNumber: orderNumber,
            user: req.session.user.id,
            items: [{
                shoe: shoe._id,
                quantity: 1,
                priceUSD: shoe.priceUSD,
                priceFRW: shoe.priceFRW
            }],
            totalUSD: totalUSD,
            totalFRW: totalFRW,
            deliveryAddress: req.body.address || {},
            status: 'pending'
        });

        await order.save();

        // Update shoe quantity
        shoe.quantity -= 1;
        await shoe.save();

        res.json({
            success: true,
            orderNumber: orderNumber,
            message: 'Purchase successful! Your order has been placed.'
        });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ error: 'Server error processing purchase' });
    }
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
});
