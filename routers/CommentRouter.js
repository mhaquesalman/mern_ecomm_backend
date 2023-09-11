const router = require('express').Router();

const { createComment, getComments } = require('../controllers/CommentController')
const authorize = require('../middlewares/authorize')

router.route('/').post(authorize, createComment).get(getComments)

module.exports = router