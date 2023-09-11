const { Schema, model } = require('mongoose');
const Joi = require('joi');

module.exports.Coupon = model('Coupon', Schema({
    name: String,
    code: {
        type: String,
        unique: true
    },
    value: Number
}, { timestamps: true }));
