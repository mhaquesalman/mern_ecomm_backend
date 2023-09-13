const router = require("express").Router();
const {
  initPayment,
  ipn,
  paymentSuccess,
  getPurchase,
  getOrders,
} = require("../controllers/paymentControllers");
const admin = require("../middlewares/admin");
const authorize = require("../middlewares/authorize");

router.route("/").get(authorize, initPayment);

router.route("/ipn").post(ipn);

router.route("/purchase").get(authorize, getPurchase);

router.route("/order").get([authorize, admin], getOrders);

router.route("/success").post(paymentSuccess);

module.exports = router;
