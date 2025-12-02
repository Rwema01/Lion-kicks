const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        shoe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shoe',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceUSD: Number,
        priceFRW: Number
    }],
    totalUSD: {
        type: Number,
        required: true
    },
    totalFRW: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        country: String,
        phone: String
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
