const { Schema, model } = require('mongoose');

module.exports.CartProductSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price: Number,
    count: Number,
});

module.exports.Purchase = model('Purchase', Schema({
    items: [CartProductSchema],
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