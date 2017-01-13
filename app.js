global.APPLICATION_PATH = __dirname;
global.ROOM_COUNT = 0;

const Database = require('./class/database'),
    Controller = require('./class/controller');

new Database((db) => {
    global.DB = db;


    const app = require('express')();

    // Allow CORS.
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*.barmania.eu");
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    server.listen(5000);

    const clients = [],
        instances = [];

    io.on('connection', (socket) => {
        console.log('new client (' + socket.handshake.address + '[' + socket.id + '])');
        clients.push(socket);
        if (clients.length > 1)
            instances.push(new Controller(io, [clients.shift(), clients.shift()]));
    });
});