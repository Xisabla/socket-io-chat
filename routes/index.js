module.exports = require('express').Router().get('/', function (req, res) {
    res.statusCode = 200;
    res.render('index', {
        layout: 'layouts/chat'
    });
});