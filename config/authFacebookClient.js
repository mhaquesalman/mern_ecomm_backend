const passport = require('passport');
const FaccebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models/user');
const _ = require('lodash');

const strategy = new FaccebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/api/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'email', 'first_name', 'middle_name', 'last_name']
}, async (accessToken, refreshToken, profile, cb) => {
    console.log("Facebook: ", profile);   

    let mail = `${profile._json.first_name}${profile._json.last_name}@facebook.com`
    let user = await User.findOne({ facebookId: profile.id, email: mail });
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
        user = new User({ facebookId: profile.id, email: mail, name: profile.displayName });
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