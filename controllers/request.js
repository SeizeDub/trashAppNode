const jwt = require('jsonwebtoken');

const Request = require('../models/request');
const Comment = require('../models/comment').commentModel;

exports.displayAll = async (req, res) => {
    try {
        let encombrants = await Request.find({task: 'encombrant'}).sort({ appointment: 'asc' });
        let depots = await Request.find({task: 'depot'}).sort({ createdAt: 'asc' });
        res.render('admin', { encombrants: encombrants, depots: depots});
    } catch {
        res.status(500).render('error');
    }
}

/**
 * @param req.body...
 * @param req.file
 */
exports.createOne = async (req, res) => {
    try {
        let data = {
            task: escapeHtml(req.body.task),
            title: escapeHtml(req.body.title),
            description: escapeHtml(req.body.description),
            imageName: req.file ? escapeHtml(req.file.filename) : null,
            address: {
                name: escapeHtml(req.body.address),
                lat: parseFloat(req.body.lat),
                lng: parseFloat(req.body.lng),
                plus: escapeHtml(req.body.addressPlus) || null,
            },
            createdAt: new Date(),
        };
        if (data.task === 'encombrant') {
            data.appointment = new Date(req.body.date);
            data.email = escapeHtml(req.body.email);
            data.phoneNumber = escapeHtml(req.body.phone);
        }
        let request = await Request.create({ ...data });
        token = jwt.sign({ requestId: request._id },'RANDOM_TOKEN_SECRET',{ expiresIn: 600 });
        res.cookie('token', token, { maxAge: 600 * 1000, httpOnly: true });
        res.status(201).json({ message: 'success' });
    } catch {
        res.status(500).json({ message: 'error' });
    }
}

/**
 * @param req.cookies.token -> requestId
 */
exports.displaySuccess = async (req, res) => {
    try {
        let decodedToken = jwt.verify(req.cookies.token, 'RANDOM_TOKEN_SECRET');
        let request = await Request.findById(decodedToken.requestId);
        res.render('success', { request: request });
    } catch {
        res.status(500).render('error');
    }
}

/**
 * @param req.params.requestId
 */
exports.deleteOne = async (req, res) => {
    try {
        let request = await Request.deleteOne({ _id: String(escapeHtml(req.params.requestId)) });
        if (!request.deletedCount) {
            throw 'error';
        }
        res.status(200).json({ message: 'success' })
    } catch {
        res.status(500).json({ message: 'error' });
    }
}

/**
 * @param req.params.requestId
 * @param req.body.commentContent
 */
exports.addComment = async (req, res) => {
    try {
        let comment = new Comment({ content: String(escapeHtml(req.body.commentContent)), createdAt: new Date() });
        let request = await Request.updateOne({ _id: String(escapeHtml(req.params.requestId)) }, { $push: { comments: comment } });
        if (!request.nModified) {
            throw 'error';
        }
        res.status(200).json({comment: comment});
    } catch {
        res.status(500).json({message: 'error'});
    }
}

/**
 * @param req.params.requestId
 * @param req.params.commentId
 */
exports.deleteComment = async (req, res) => {
    try {
        let request = await Request.updateOne({ _id: String(escapeHtml(req.params.requestId)) }, { $pull: { comments: { _id: String(escapeHtml(req.params.commentId)) } } });
        if (!request.nModified) {
            throw 'error';
        }
        res.status(200).json({message: 'success'})
    } catch {
        res.status(500).json({message: 'error'});
    }
}

function escapeHtml(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}