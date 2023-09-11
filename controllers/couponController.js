const _ = require('lodash')
const { Coupon } = require('../models/Coupon')

module.exports.createCoupon = async (req, res) => {
    const { name, code, value } = _.pick(req.body, ["name", "code", "value"])
    const coupon = new Coupon({name: name, code: code.toUpperCase(), value: value})
    const result = await coupon.save()
    return res.status(201).send({
        message: "Coupon is created Succesfully!",
        data: result
    })

}

module.exports.getCoupons = async (req, res) => {
    const coupons = await Coupon.find().sort({createdAt: 1})
    return res.status(200).send(coupons)
}

module.exports.getCoupounByCode = async (req, res) => {
    const code = req.query.c
    const coupon = await Coupon.find({ code: code})
    console.log("coupon ", coupon)
    return res.status(200).send(coupon)
}