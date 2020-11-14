const mongoose = require('mongoose');

const Comment = require('./comment').commentSchema;

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
    comments: [Comment]
});

const encombrantModel = mongoose.model('Encombrant', encombrantSchema);

// class Encombrant extends encombrantModel {
//     constructor(req) {
//         super();
//         this.title = req.body.title,
//         this.description = req.body.description,
//         this.imageName = req.file ? req.file.filename : null,
//         this.address = {
//             name: req.body.address,
//             lat: req.body.lat,
//             lng: req.body.lng,
//             plus = req.body.addressPlus || null,
//         },
//         this.appointment = new Date(req.body.date);
//         this.email = req.body.email;
//         this.phoneNumber = req.body.phone;
//         this.createdAt = new Date()
//     }
// }

// module.exports = Encombrant;