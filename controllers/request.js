const Encombrant = require('../models/encombrant');
const Depot = require('../models/depot');
const jwt = require('jsonwebtoken');
const Comment = require('../models/comment').commentModel;

exports.displayList = async (req, res) => {
    try {
        let encombrants = await Encombrant.find({}).sort({ appointment: 'asc' }).exec();
        let depots = await Depot.find({}).sort({ createdAt: 'asc' }).exec();
        res.render('admin', { encombrants: encombrants, depots: depots});
    } catch {
        res.status(500).render('error');
    }
}

exports.create = async (req, res) => {
    try {
        let task = req.params.task;
        let data = {
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
        let response;
        if (task === 'encombrant') {
            response = await Encombrant.create({ ...data });
        } else if (task === 'depot') {
            response = await Depot.create({ ...data });
        }
        if (!response.ok) {
            throw 'error';
        }
        token = jwt.sign({ task: task, requestId: request._id },'RANDOM_TOKEN_SECRET',{ expiresIn: 86400 });
        res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: true });
        res.status(201).json({ message: 'success' });
    } catch {
        res.status(400).json({ message: 'error' });
    }
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

exports.delete = async (req, res) => {
    try {
        let task = req.body.task;
        let id = req.body.id;
        let response;
        if (task === 'encombrant') {
            response = await Encombrant.deleteOne({ _id: id });
        } else if (task === 'depot') {
            response = await Depot.deleteOne({ _id: id })
        }
        if (!response.ok) {
            throw 'error';
        }
        res.status(204).json({message: 'success'})
    } catch {
        res.status(500).json({message: 'error'});
    }
}

exports.listTasks = async (req, res) => {
    try {
        let encombrants = await Encombrant.find({}).sort({ appointment: 'asc' }).exec();
        let depots = await Depot.find({}).sort({ createdAt: 'asc' }).exec();
        res.render('admin', { encombrants: encombrants, depots: depots});
    } catch {
        res.status(500).render('error');
    }
}

exports.createComment = async (req, res) => {
    try {
        let task = req.body.task;
        let id = req.body.id;
        let content = req.body.content;
        let comment = new commentModel({ content: content, createdAt: new Date() });
        let response;
        if (task === 'encombrant') {
            response = await Encombrant.findOne({ _id: id });
        } else if (task === 'depot') {
            response = await Depot.findOne({ _id: id });
        }
        response.comments.push(comment);
        response.save();
        res.status(204).json({message: 'success'})
    } catch {
        res.status(500).json({message: 'error'});
    }
}

exports.deleteComment = async (req, res) => {
    try {
        let task = req.body.task;
        let id = req.body.id;
        let commentId = req.body.commentId;
        let response;
        if (task === 'encombrant') {
            response = await Encombrant.findOne({ _id: id });
        } else if (task === 'depot') {
            response = await Depot.findOne({ _id: id });
        }
        response.comments.filter(comment => comment._id !== commentId);
        response.save();
        res.status(204).json({message: 'success'})
    } catch {
        res.status(500).json({message: 'error'});
    }
}