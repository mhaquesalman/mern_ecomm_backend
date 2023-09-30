const router = require("express").Router();
const passport = require("passport");
require("../config/authFacebookClient");

const CLIENT_URL = "http://localhost:3000/login";
let data = {};

router.route("/").get(passport.authenticate("facebook"));

router.route("/redirect").get(
  passport.authenticate("facebook", { session: false }),
  (req, res, next) => {
    // console.log("redirect ", req.user)
    req.body = req.user;
    next();
  },
  (req, res) => {
    // console.log("success res ", req.body)
    data = req.body;
    res.redirect(CLIENT_URL);
  }
);

module.exports.getFacebookUser = () => {
  // console.log("method body data", data)
  return data;
};

module.exports.authFacebookRouter = router;
