const Database = require('./class/database'),
    Controller = require('./class/controller'),
    {log, guid} = require('./functions'),
    app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

new Database((db) => {

    // Allow CORS.
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*.barmania.eu");
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    const clients = [],
        instances = {};

    // Client connects
    io.on('connection', (socket) => {
        log('new client (' + socket.handshake.headers['x-forwarded-for'] + '[' + socket.id + '])');
        // Add socket to client queue
        clients.push(socket);
        if (clients.length > 1) {
            // Create new controller instance and add 2 clients
            const controller = new Controller(io, guid(), db);
            controller.addPlayer(clients.shift(), clients.shift());
            instances[controller.getId()] = controller;

            controller.on('disconnect', () => {
                //todo: listen for new connection after client disconnects
                if (controller.players.size() == 0) {
                    delete instances[controller.getId()];
                    log('room ' + controller.room_name + ' closed', 'red');
                }
            }).on('done', () => {//disconnect players and delete instance todo: play again -> push back to client queue
                controller.players.each((player) => {
                    player.getSocket().disconnect();
                });
                delete instances[controller.getId()];
            });
        }
    });

    server.listen(5000);
    console.log('server is running on port 5000');
});