/* eslint no-console: 0 */

require('dotenv').config();
var chalk = require('chalk');
var fs = require('fs');
var moment = require('moment');
var path = require('path');

/**
 * Console logger for node.js
 * @version 1.0.0
 */

/**
 * Logger constructor
 * @param  {string} logFolderName Name of the log folder, usually 'logs'
 * @return {object}               Logger object
 */
var Logger = function (logFolderName) {
    this.version = '1.0.0';

    // 'DEBUG', is the default level (and prefix)
    this.level = 'DEBUG';
    this.moment = moment();
    // Check if there is 'logFolderName' value, otherwise put this.logFolder and this.logFile to 'false'
    this.logFolder = (logFolderName) ? path.join(__dirname, '../', logFolderName) : false;
    this.logFile = (logFolderName) ? path.join(this.logFolder, this.moment.format('DDMMYY-HHmmss') + '.log') : false;

    if (this.logFolder) {
        // Creating log folder if it doesn't exists
        if (!fs.existsSync(this.logFolder)) {
            fs.mkdirSync(this.logFolder);
        }
        // Creating log file if it doesn't exists
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, '');
        }
    }
}

/**
 * Format the message to log
 * @param  {string} message Message to log
 * @return {string}         Message with prefix and time ([prefix][time] message)
 */
Logger.prototype.format = function (message) {
    return '[' + this.level + '][' + moment().format('HH:mm:ss') + '] ' + message;
}

/**
 * Log the message and log in the log file (if this.logFile is not 'false')
 * @param  {string} prefix  Message prefix (ex: DEBUG, INFO, WARN, ERROR, FATAL)
 * @param  {string} message Message to log
 * @param  {function} color   Chalk color, ex: require('chalk').red, chalk.blue (facultative)
 */
Logger.prototype.log = function (prefix, message, color) {
    // For no prefix cases (ex: logger.log('Hello World'), logger.log('Hello World', chalk.blue))
    if ((!message && !color) || (typeof (message) === 'function')) {
        // Check for color
        color = (message) ? message : false;
        // Message is at the prefix argument's place
        message = prefix;
        // Use last used prefix
        prefix = this.level;
    }

    this.level = prefix;

    // Do not log 'DEBUG' in console, if process.env.DEBUG is not on TRUE
    if ((this.level == 'DEBUG' && process.env.DEBUG) || this.level != 'DEBUG') {
        if (color) {
            console.log(color(this.format(message)));
        } else {
            console.log(this.format(message));
        }
    }

    // Add logs to log file
    if (this.logFile) {
        fs.appendFileSync(this.logFile, this.format(message) + '\n');
    }
}

// Basics log levels
Logger.prototype.debug = function (message) {
    this.log('DEBUG', message, chalk.gray);
}
Logger.prototype.info = function (message) {
    this.log('INFO', message, chalk.blue);
}
Logger.prototype.warn = function (message) {
    this.log('WARN', message, chalk.yellow);
}
Logger.prototype.error = function (message) {
    this.log('ERROR', message, chalk.red);
}
Logger.prototype.fatal = function (message) {
    this.log('FATAL', message, chalk.red);
}

module.exports = Logger;