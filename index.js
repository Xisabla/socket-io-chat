// Loading .env file config
require('dotenv').config();

// Basic requires
var chalk = require('chalk');
var express = require('express');
var http = require('http');
var path = require('path');

// Logger
var Logger = require('./lib/logger');
var Console = new Logger();

// Setting up express server with Socket.IO
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

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
    socket.emit('welcome', 'Hello World');
    Console.log('Socket.IO', 'New client connected', chalk.cyan);
});

// Starting server
server.listen(app.get('port'), function () {
    Console.info('Starting server...');
    Console.info('Listenning on port ' + app.get('port'));
    Console.debug('Local server: http://localhost:' + app.get('port') + '/');
});