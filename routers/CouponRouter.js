const router = require('express').Router();
const { createCoupon, getCoupons, getCoupounByCode } = require('../controllers/couponController')
const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorize');

router.route('/')
    .post([authorize, admin], createCoupon)
    .get(getCoupons);

router.route('/code').get(getCoupounByCode)    
module.exports = router;