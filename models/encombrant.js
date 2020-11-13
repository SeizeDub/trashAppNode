const mongoose = require('mongoose');

const commentSchema = require('./comment');

const encombrantSchema = mongoose.Schema({
    title: { type: String, required: true, maxlength: 20},
    description: { type: String, required: true, maxlength: 1000 },
    imageName: { type: String, maxlength: 100},
    address: { 
        name: { type: String, required: true, maxlength: 200 },
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 },
        plus: { type: String, maxlength: 200 }
    },
    appointment: { type: Date, required: true },
    email: {type: String, required: true, maxlength: 100 },
    phoneNumber: {type: String, required: true, maxlength: 20 },
    createdAt: { type: Date, require: true },
    comments: [commentSchema]
});

module.exports = mongoose.model('Encombrant', encombrantSchema);