const { Schema, model } = require('mongoose');

module.exports.PurchaseProductSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price: Number,
    count: Number,
});

module.exports.PurchaseProductSchema = PurchaseProductSchema
module.exports.PurchaseProduct = model("PurchaseProduct", PurchaseProductSchema);