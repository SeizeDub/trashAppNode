const express = require('express');
const app = express();
const mongoose = require('mongoose');

const requestRoutes = require ('./routes/request');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

mongoose.connect('mongodb+srv://seize:seize16@cluster0.7cyws.mongodb.net/trashApp?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log(error.message));

app.set('view engine', 'pug');
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/request', requestRoutes);
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

module.exports = app;