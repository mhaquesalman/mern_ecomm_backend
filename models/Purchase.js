const { Schema, model } = require('mongoose');
const { PurchaseProductSchema } = require('../models/PurchaseProduct')
const { CartItemSchema } = require('../models/cartItem')

module.exports.Purchase = model('Purchase', Schema({
    items: [CartItemSchema],
    transaction_id: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Complete"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    purchaseAmount: Number,
    purchaseCount: Number,
    productNames: String,
    validatePayment: { type: Boolean, default: false}
}, { timestamps: true }))