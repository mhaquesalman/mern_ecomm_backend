const router = require("express").Router();
const passport = require("passport");
require("../config/authGoogleClient");

const CLIENT_URL = "http://localhost:3000/login";
let data = {};

router.route("/").get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/redirect").get(
  passport.authenticate("google", { session: false }),
  (req, res, next) => {
    req.body = req.user;
    next();
  },
  (req, res) => {
    // console.log("success res ", req.body)
    data = req.body;
    res.redirect(CLIENT_URL);
  }
);

module.exports.getGoogleUser = () => {
  // console.log("method body data", data)
  return data;
};

module.exports.authGoogleRouter = router;
