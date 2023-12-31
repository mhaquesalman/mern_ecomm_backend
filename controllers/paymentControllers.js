const { CartItem } = require('../models/cartItem');
const { Profile } = require('../models/profile');
const PaymentSession = require('ssl-commerz-node').PaymentSession;
const { Order } = require('../models/order');
const { Payment } = require('../models/payment');
const { Purchase } = require('../models/Purchase')
const { PurchaseProduct } = require('../models/PurchaseProduct')
const path = require('path');
const fetch = require('node-fetch');
let formData = require('form-data')

// Request a Session
// Payment Process
// Receive IPN
// Create an Order
// Validate Order 

module.exports.ipn = async (req, res) => {
    const payment = new Payment(req.body);
    const tran_id = payment['tran_id'];
    if (payment['status'] === 'VALID') {
        const order = await Order.updateOne({ transaction_id: tran_id }, { status: 'Complete' });
        await CartItem.deleteMany(order.cartItems);
        
    } else {
        Order.deleteOne({ transaction_id: tran_id });
        await Purchase.deleteOne({ transaction_id: tran_id });
    }
    await payment.save()
    if (payment["status"] === "VALID") {
        const val_id = payment['val_id']
        // const payData = {
        //     val_id: val_id,
        //     store_id: process.env.STORE_ID,
        //     store_passwrod: process.env.STORE_PASSWORD
        // }
        // for (key in payData) {
        //     formData.append(key, payData[key])
        // }
        const url = 
        `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASSWORD}`
        fetch(url)
        .then(res => res.json())
        .then(async (data) => {
            if (data["status"] === "VALID" || "VALIDATED") {
                Order.updateOne({ transaction_id: tran_id }, { validatePayment: true })
                await Purchase.updateOne({ transaction_id: tran_id }, { validatePayment: true })  
                return res.status(200).send({
                    message: "Validation complete!",
                    data: data
                });
            } else if (data["status"] === "INVALID_TRANSACTION") {
                return res.status(404).send({
                    message: "Validation incomplete!"
                })
            }
        })
        .catch(err => {
            console.log("Validation error! ", err)
            return res.status(200).send("IPN Incomplete!");
        })
    } else {
        return res.status(200).send("IPN Unsuccessful!");
    }
   
}


module.exports.initPayment = async (req, res) => {
    const userId = req.user._id;
    const amount = req.query.amt;
    const cartItems = await CartItem.find({ user: userId }).populate('product', 'name');
    const profile = await Profile.findOne({ user: userId });

    const { address1, address2, city, state, postcode, country, phone } = profile;

    // const total_amount = cartItems.map(item => item.count * item.price).reduce((a, b) => a + b, 0);
    const total_amount = amount

    const total_item = cartItems.map(item => item.count).reduce((a, b) => a + b, 0);

    const product_names_map = cartItems.map(item => item.product.name)
    let product_name = ""
    product_names_map.forEach((name, i) => {
        if (i == product_names_map.length - 1) product_name = product_name.concat(name)
        else product_name = product_name.concat(name + ", ")
    })
    
    const tran_id = '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime();

    const payment = new PaymentSession(true, process.env.STORE_ID, process.env.STORE_PASSWORD);

    // Set the urls
    payment.setUrls({
        success: 'https://mern-ecomm-backend-z21l.onrender.com/api/payment/success', // If payment Succeed
        fail: 'yoursite.com/fail', // If payment failed
        cancel: 'yoursite.com/cancel', // If user cancel payment
        ipn: 'https://mern-ecomm-backend-z21l.onrender.com/api/payment/ipn' // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: total_amount, // Number field
        currency: 'BDT', // Must be three character string
        tran_id: tran_id, // Unique Transaction id 
        emi_option: 0, // 1 or 0
    });

    // Set customer info
    payment.setCusInfo({
        name: req.user.name,
        email: req.user.email,
        add1: address1,
        add2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
        phone: phone,
        fax: phone
    });

    // Set shipping info
    payment.setShippingInfo({
        method: 'Courier', //Shipping method of the order. Example: YES or NO or Courier
        num_item: total_item,
        name: req.user.name,
        add1: address1,
        add2: address2,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: product_name,
        product_category: 'General',
        product_profile: 'general'
    });

    response = await payment.paymentInit();

    const order = new Order({ 
        cartItems: cartItems, 
        user: userId, 
        transaction_id: tran_id, 
        address: profile,
        orderAmount: total_amount,
        orderCount: total_item, 
        productNames: product_name 
    });

    if (response.status === 'SUCCESS') {
        order.sessionKey = response['sessionkey'];
        await order.save();

        // const cartProductItems = cartItems.map(item => new PurchaseProduct({
        //     product: item.product,
        //     price: item.price,
        //     count: item.count
        // }))
       
        const purchase = new Purchase({
            items: cartItems,
            transaction_id: tran_id,
            user: userId,
            purchaseAmount: total_amount,
            purchaseCount: total_item,
            productNames: product_name
        })
        await purchase.save()
    }
    return res.status(200).send(response);
}


module.exports.getPurchase = async (req, res) => {
    const userId = req.user._id;
    const purchase = await Purchase.find({ user: userId })

    if (purchase) {
        return res.status(200).send(purchase)
    } else {
        return res.status(200).send([])
    }
}

module.exports.getOrders = async (req, res) => {
    const order = await Order.find().populate("user", "name")

    if (order) {
        return res.status(200).send(order)
    } else {
        return res.status(200).send([])
    }
}

module.exports.paymentSuccess = async (req, res) => {
    res.sendFile(path.join(__basedir + "/public/success.html"))
}