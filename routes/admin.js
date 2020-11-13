const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

const cookieParser = require('cookie-parser');
const adminAuth = require('../middlewares/admin-auth');

router.post('/login', express.text(), adminController.login);

router.use(cookieParser());
router.use(adminAuth);

router.get('/', adminController.listTasks);

module.exports = router;