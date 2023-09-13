const { Schema, model } = require('mongoose');
const { PurchaseProductSchema } = require('../models/PurchaseProduct')

module.exports.Purchase = model('Purchase', Schema({
    items: [PurchaseProductSchema],
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
    validatePayment: { type: Boolean, default: false}
}, { timestamps: true }))