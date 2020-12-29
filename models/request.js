const mongoose = require('mongoose');

const Comment = require('./comment').commentSchema;

const requestSchema = mongoose.Schema({
    task: { type: String, required: true, enum: ['encombrant', 'depot'] },
    title: { type: String, required: true, maxlength: 20},
    description: { type: String, required: true, maxlength: 1000 },
    imageName: { type: String, maxlength: 100},
    address: { 
        name: { type: String, required: true, maxlength: 200 },
        lat: { type: Number, required: true, min: -90, max: 90 },
        lng: { type: Number, required: true, min: -180, max: 180 },
        plus: { type: String, maxlength: 200 }
    },
    createdAt: { type: Date, required: true },
    comments: [Comment],
    appointment: { type: Date, required: function() { return this.task === 'encombrant' } },
    email: {type: String, required: function() { return this.task === 'encombrant' }, maxlength: 100 },
    phoneNumber: {type: String, required: function() { return this.task === 'encombrant' }, maxlength: 20 }
});

module.exports = mongoose.model('Request', requestSchema);