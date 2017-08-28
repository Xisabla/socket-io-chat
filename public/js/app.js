var data = {};

$(document).ready(function () {

    var socket = io();
    var data = getData();

    socket.on('users-list', function (users) {
        data.users = users;
        $('#chat-users-list').text('');
        users.forEach(function (user) {
            $('#chat-users-list').append($('<li>').html('<a href="#">' + user.username + '</a>'));
        });
    });

    socket.on('session', function (session) {
        data.session = session;
        $('#chat-username').modal('hide');
        $('#chat-client').append($('<li>').addClass('message').html('Welcome <strong>' + data.username + '</strong><br>Join a channel now or create one 😏'));
        $('#chat-client-form input[name=message]').focus();
    });

    if (!data.session) {
        $('#chat-username').modal({
            backdrop: 'static',
            keyboard: false
        });

        setTimeout(function () {
            $('#chat-username-form input[name=username]').focus();
        }, 600);

        $('#chat-username-form').submit(function () {
            var valid = true;
            var username = $('#chat-username-form input[name=username]').val();

            data.users.forEach(function (user) {
                if (user.username == username) {
                    valid = false;
                }
            });

            if (valid) {
                data.username = username;
                $('#chat-username-ok').show(500);
                $('#chat-username-form input[name=username]').addClass('disabled').prop('disabled', true);
                $('#chat-username-form button[type=submit]').addClass('disabled').prop('disabled', true);
                socket.emit('new-user', username);
            } else {
                $('#chat-username-taken').show(500);
            }
            return false;
        });
    }
});

function getData() {
    return {};
}