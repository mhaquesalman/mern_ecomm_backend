const _ = require('lodash');
const { Comment, validate } = require('../models/Comment');
const { Product } = require('../models/product');

module.exports.createComment = async (req, res) => {
    let { commentBody, commentRating, product} = _.pick(req.body, ["commentBody", "commentRating", "product"]);
    let comment = new Comment({
        product: product,
        commentBody: commentBody,
        commentRating: commentRating,
        user: req.user._id
    })
    // console.log("comment ", comment)
    // const { error } = validate(comment);
    // if (error) return res.status(400).send(error.details[0].message);
    const result = await comment.save()
    const avgRating = await getAvgRating(product)
    console.log("avg ", avgRating)
    const p = await Product.updateOne({ _id: product }, { rating: avgRating})
    console.log("p ", p)
    return res.status(201).send({
        message: "Comment is posted successfully!",
        data: result
    })
}

module.exports.getComments = async (req, res) => {
    const pid = req.query.pid ? req.query.pid : ""
    const comments = await Comment.find({
        product: pid
    })
    .populate("user", "name")
    // console.log("comment ", comments)
    if (!comments) return res.status(404).send("")
    return res.status(200).send(comments)
}

async function getAvgRating(pid) {
    const commentOfProduct = await Comment.find({ product: pid})
        .select({ commentRating: 1 })

    let total = 0;
    let length = commentOfProduct.length
    commentOfProduct.forEach(({commentRating}) => total += commentRating)
    const avg = isNaN(total/length) ? 0 : (total/length)
    
    // console.log("commentOfProduct ", commentOfProduct)

    return Math.floor(avg);

}