const Encombrant = require('../models/encombrant');
const Depot = require('../models/depot');
const commentSchema = require('../models/comment');
const jwt = require('jsonwebtoken');

exports.create = (req, res) => {
    let task = req.body.task;
    let request = {
        title: req.body.title,
        description: req.body.description,
        imageName: req.file ? req.file.filename : null,
        address: {
            name: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            plus: req.body.addressPlus || null,
        },
        createdAt: new Date()
    };
    if (task === 'encombrant') {
        request.appointment = new Date(req.body.date);
        request.email = req.body.email;
        request.phoneNumber = req.body.phone;
        request = new Encombrant({...request});
        // request.comments.push(new commentSchema({content: "Encombrant non présent, propriétaire non joignable au téléphone."}));
    } else if (task === 'depot') {
        request = new Depot({...request});
    }
    request.save()
    .then(() => {
        token = jwt.sign({ task: task, requestId: request._id },'RANDOM_TOKEN_SECRET',{ expiresIn: 86400 });
        res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: true });
        res.status(201).json({message: 'success'});
    })
    .catch(error => res.status(400).json({ error }));
}

exports.displaySuccess = async (req, res) => {
    let token = req.cookies.token;
    let decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    let requestId = decodedToken.requestId;
    let task = decodedToken.task;
    let request;
    if (task === 'encombrant') {
        request = await Encombrant.findById(requestId);
    } else if (task === 'depot') {
        request = await Depot.findById(requestId);
    }
    res.status(201).render('success', { task: task, request: request });
}