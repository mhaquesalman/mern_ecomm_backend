const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/user');
const _ = require('lodash');

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/api/auth/google/redirect"
}, async (accessToken, refreshToken, profile, cb) => {
    // console.log("Google: ", profile);
    let user = await User.findOne({ googleId: profile.id, email: profile._json.email });
     if (user) {
        //console.log("User exists:", user);
        const token = user.generateJWT();
        const response = {
            message: "User already exist!",
            token: token,
            user: _.pick(user, ["name", "email", "_id"])
        }
        cb(null, response);
    } else {
        user = new User({ googleId: profile.id, email: profile._json.email, name: profile._json.name });
        const result = await user.save();
        const token = user.generateJWT();
        const response = {
            message: "Login Successful!",
            token: token,
            user: _.pick(result, ["name", "email", "_id"])
        }
        cb(null, response);
        //console.log("New User:", user);
    } 
})

passport.use(strategy);