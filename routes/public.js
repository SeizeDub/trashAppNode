const express = require('express');
const router = express.Router();

const cookieParser = require('cookie-parser');
const multer = require('../middlewares/multer-config');

const requestController = require('../controllers/request');

router.get('/', (req, res) => {
    res.render('home');
});

router.get('/requete/:task', (req, res) => {
    let task = req.params.task;
    if (!['encombrant', 'depot'].includes(task)) {
        res.status(404).render('404');
    }
    res.render('requete', {task: task});
});

router.get('/success', cookieParser(), requestController.displaySuccess);

router.post('/request/create', multer,  requestController.createOne);

router.use((req, res) => {
    res.status(404).render('404');
});

module.exports = router;