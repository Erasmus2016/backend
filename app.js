global.APPLICATION_PATH = __dirname;
global.ROOM_COUNT = 0;
global.VALIDATOR = require('./functions/validator/dataChecker');
global.RANDOM_NUMBER = require('./functions/randomNumber');

var Controller = require('./class/controller');

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(5000);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var clients = [];
var instances = [];
io.on('connection', function (socket) {
    console.log('new client (' + socket.handshake.address.address + ')');
    clients.push(socket);
    if (clients.length > 1)
        instances.push(new Controller(io, [clients.shift(), clients.shift()]));
});