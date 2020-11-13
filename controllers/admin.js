const Encombrant = require('../models/encombrant');
const Depot = require('../models/depot');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    if (req.body === 'adminpassword') {
        let adminToken = jwt.sign({ loggedInAs: 'admin' },'RANDOM_ADMIN_SECRET',
        { expiresIn: 86400 });
        res.cookie('adminToken', adminToken, { maxAge: 86400 * 1000, httpOnly: true });
        res.status(200).json({message: 'success'});
    } else {
        res.status(400).json({message: 'invalid'});
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

exports.deleteTask = async (req, res) => {
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

exports.createComment = async (req, res) => {
    try {
        let task = req.body.task;
        let id = req.body.id;
        let content = req.body.content;
        let response;
        let comment = new Comment({ content: content });
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

