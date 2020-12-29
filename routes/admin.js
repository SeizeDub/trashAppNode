const express = require('express');
const router = express.Router();

const cookieParser = require('cookie-parser');
const adminAuth = require('../middlewares/admin-auth');

const adminController = require('../controllers/admin');
const requestController = require('../controllers/request');


router.post('/login', express.text(), adminController.login);

router.use(cookieParser());
router.use(adminAuth);

router.get('/', requestController.displayAll);
router.delete('/:requestId', requestController.deleteOne);
router.patch('/:requestId', express.json(), requestController.addComment);
router.patch('/:requestId/:commentId', requestController.deleteComment);

module.exports = router;