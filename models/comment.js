const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, require: true }
});

const commentModel = mongoose.model('Comment', commentSchema);

exports.commentSchema = commentSchema;
exports.commentModel = commentModel;



