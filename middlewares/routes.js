const userRouter = require('../routers/userRouter');
const categoryRouter = require('../routers/categoryRouter');
const productRouter = require('../routers/productRouter');
const cartRouter = require('../routers/cartRouter');
const profileRouter = require('../routers/profileRouter');
const paymentRouter = require('../routers/paymentRouter');
const commentRouter = require('../routers/CommentRouter')
const couponRouter = require('../routers/CouponRouter');
const {authGoogleRouter} = require('../routers/authGoogleRouter');
const {authFacebookRouter} = require('../routers/authFacebookRouter');

module.exports = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/auth/google', authGoogleRouter);
    app.use('/api/auth/facebook', authFacebookRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/product', productRouter);
    app.use('/api/comment',commentRouter)
    app.use('/api/cart', cartRouter);
    app.use('/api/profile', profileRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/payment', paymentRouter);
}