const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
    id: { 
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Sneakers', 'Casual', 'Boots', 'Formal']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Kids']
    },
    priceUSD: {
        type: Number,
        required: true,
        min: 0
    },
    priceFRW: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    sizes: {
        type: String,
        required: true
    },
    material: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Shoe', shoeSchema);
