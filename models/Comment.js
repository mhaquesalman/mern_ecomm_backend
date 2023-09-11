const { Schema, model } = require('mongoose')
const Joi = require('joi');

const CommentSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    commentBody: String,
    commentRating: { type: Number, default: 1, min: 1, max: 5},
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

// module.exports.validate = comment => {
//     const schema = Joi.object({
//         product: Joi.string().required(),
//         commentBody: Joi.string().required(),
//         commentRating: Joi.number().min(1).max(5).required(),
//         user: Joi.string().required()
//     })
//     return schema.validate(comment)
// }

module.exports.Comment = model("Comment", CommentSchema)