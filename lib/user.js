var md5 = require('md5');
var moment = require('moment');
var uuid = require('uuid/v4');

var User = function (username) {
    this.uuid = uuid();
    this.username = username;
    this.moment = moment();
    var session = md5(this.moment + '.' + this.username);

    this.getSession = function () {
        return session;
    }
}

module.exports = User;