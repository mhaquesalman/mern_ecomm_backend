const router = require('express').Router();
const { signIn, signUp } = require('../controllers/userControllers');
const { getGoogleUser } = require("./authGoogleRouter");
const { getFacebookUser } = require('./authFacebookRouter');

router.route('/signup')
    .post(signUp);

router.route('/signin')
    .post(signIn);

router.route('/googleSignin')
.get((req, res) => {
    const googleUser = getGoogleUser()
    // console.log("googleSignin signin data ", googleUser)
    res.status(200).send(googleUser)
})
 
router.route('/facebookSignin')
.get((req, res) => {
    const faceBookUser = getFacebookUser()
    console.log("facebookSignin signin data ", faceBookUser)
    res.status(200).send(faceBookUser)
})

  
module.exports = router;