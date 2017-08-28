// Loading .env file config
require('dotenv').config();

// Basic requires
var chalk = require('chalk');
var express = require('express');
var http = require('http');
var path = require('path');

// Lib requires
var Logger = require('./lib/logger');
var User = require('./lib/user');

// Objects init
var Console = new Logger();

// Setting up express server with Socket.IO
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

var users = [];
var channels = [];

// Server config
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// "public" folder as static
app.use(express.static(path.join(__dirname, 'public')));

// Routes usage
app.use('/', require('./routes/index'));

// Socket.IO
io.on('connection', function (socket) {
    // Send users-list
    socket.emit('users-list', users); // Send users list
    Console.log('Socket.IO', 'New client connected', chalk.cyan);

    // Register new user & update users list
    socket.on('new-user', function (username) {
        var user = new User(username);
        users.push(user);
        socket.user = user;
        socket.emit('session', user.getSession());
        socket.emit('channels-list', channels);
        io.emit('users-list', users);
        Console.log('Socket.IO', 'New user joined: ' + username, chalk.yellow);
        Console.debug('User list updated: ' + users);
    });

    socket.on('disconnect', function () {
        if (socket.user) {
            var index = users.indexOf(socket.user);
            Console.log('Socket.IO', users[index]['username'] + ' disconnected', chalk.red);
            users.splice(index, 1);
            io.emit('users-list', users);
        }
    });
});

// Starting server
server.listen(app.get('port'), function () {
    Console.info('Starting server...');
    Console.info('Listenning on port ' + app.get('port'));
    Console.debug('Local server: http://localhost:' + app.get('port') + '/');
});