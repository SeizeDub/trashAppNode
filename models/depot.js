const mongoose = require('mongoose');

const commentSchema = require('./comment');

const depotSchema = mongoose.Schema({
    title: { type: String, required: true, maxlength: 20},
    description: { type: String, required: true, maxlength: 1000 },
    imageName: { type: String, maxlength: 100},
    address: { 
        name: { type: String, required: true, maxlength: 200 },
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 },
        plus: { type: String, maxlength: 200 }
    },
    createdAt: { type: Date, require: true },
    comments: [commentSchema]
});

module.exports = mongoose.model('Depot', depotSchema);