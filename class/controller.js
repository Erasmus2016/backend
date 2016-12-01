var Game = require(APPLICATION_PATH + '/class/game');
var Player = require(APPLICATION_PATH + '/class/player');
module.exports = function (io, sockets) {
    var _this = this;
    this.game = new Game();
    this.players = [];
    this.players.next = function () {
        if (this.current + 1 == this.length)
            return this[0];
        return this[++this.current];
    };
    this.players.current = function () {
        return this[this.current];
    };
    this.players.current = 0;
    this.room = io.sockets.in('ROOM_' + (++ROOM_COUNT));

    sockets.forEach(function (socket) {
        _this.players[socket.id] = new Player(socket);
        socket.join('ROOM_' + ROOM_COUNT);
    });

    this.on = function (event, callback) {
        _this.players.forEach(function (player) {
            player.getSocket().on(event, function (data) {
                callback(data, player);
            });
        });
    };

    this.on('login', function (data, player) {
        if (VALIDATOR.isColorValid(data.color) || VALIDATOR.isLanguageValid(data.lang))
            throw "";

        player.color = data.color;
        player.lang = data.lang;
        player.name = data.name;
        player.isReady = true;
        this.checkReady();
    });

    this.checkReady = function () {
        this.players.forEach(function (player) {
            if (!player.isReady)
                return false;
        });
        this.gameRound();
    };

    this.gameRound = function () {
        players.current().emit('roll-the-dice');
    };

    this.on('roll-the-dice', function (data, player) {
        if (player.getId() == this.players.current().id) {
            var dice = RANDOM_NUMBER.getRandomDiceValue();
            player.emit('dice-result', dice);
            this.process(dice);
        }
    });

    this.gameOver = function () {
        this.room.emit('game-over', this.players.current().getId());
    };

    this.handleQuestion = function (resolve, reject) {
        //todo get question
        var weight = 5;
        this.players.current().emit('question', {});
        this.players.current().once('answer', function (data) {
            //check answer
            if (true) {
                _this.players.current().addPosition(weight);
            } else {
                _this.players.current().subPosition(weight);
            }
            resolve();
        });
        setTimeout(function () {
            _this.players.current().subPosition(weight);
            resolve();
        }, 20000);
    };

    this.process = function (dice) {
        var pos = this.players.current().addPosition(dice);

        if (this.game.getField().length > pos - 1) {
            this.gameOver();
            return;
        } else if (pos < 0) {
            //move to start
            this.players.current().setPosition(0);
        }

        var step = this.game.getField()[pos];

        var promise = new Promise(function (resolve, reject) {
            switch (step.type) {
                case 'default':
                    resolve();
                    break;
                case 'question':
                    _this.handleQuestion(resolve, reject);
                    break;
                case 'jump':
                    _this.players.current().setPosition(step.jumpDestinationId);
                    resolve();
                    break;
                default:
                    throw 'unknown field type';
            }
        });

        promise.then(function () {
            _this.players.next();
            _this.gameRound();
        }).error(function () {
            throw 'unknown error';
        });
    };

};