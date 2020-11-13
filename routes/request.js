const express = require('express');
const router = express.Router();

const multer = require('../middlewares/multer-config');

const requestController = require('../controllers/request');

router.post('/create', multer, requestController.create);

module.exports = router;