//TODO: set category on game class on game init.


var Game = require(APPLICATION_PATH + '/class/game');
var Player = require(APPLICATION_PATH + '/class/player');
//var Question = require(APPLICATION_PATH + '/class/question');

module.exports = function (io, sockets) {
    var _this = this;
    this.game = new Game();
    this.players = [];
    //this.question = new Question();
    this.players.next = function () {
        if (this.current + 1 == this.length)
            return this[0];
        return this[++this.current];
    };
    this.players.current = function () {
        return this[this.current];
    };
    this.players.forEach = function (callback) {
        for (let i = 0; i < this.length; i++)
            callback(this[i], i, this);

    };
    this.players.current = 0;
    this.room_name = 'ROOM_' + (++ROOM_COUNT);
    this.room = io.sockets.in(this.room_name);

    sockets.forEach(function (socket) {
        _this.players.push(new Player(socket));
        socket.join(_this.room_name);
    });

    console.log('new room (' + this.room_name + ')');

    this.room.emit('login');

    this.on = function (event, callback) {
        this.players.forEach(function (player) {
            player.getSocket().on(event, function (data) {
                callback(data, player);
            });
        });
    };

    this.on('login', function (data, player) {
        console.log(data);
        if (!VALIDATOR.isColorValid(data.color) || !VALIDATOR.isLanguageValid(data.lang) || !VALIDATOR.isCategoryValid(data.category)) {
            throw "Invalid data (color, category or language) from client.";
        }

        player.lang = data.lang;
        player.name = data.name;
        _this.game.setCategory(data.category);

        // Check if player color is still available.
        if (_this.game.isColorAvailable(data.color)) {
            player.color = data.color;
            _this.players.forEach(function (player) {
                player.emit('available-colors', _this.game.getAllAvailableColors);
            });
            //this.room.emit('available-colors', this.game.getAllAvailableColors);
            player.isReady = true;
            _this.checkReady();
        }
    });

    this.checkReady = function () {
        _this.players.forEach(function (player) {
            if (!player.isReady)
                return false;
        });
        _this.players.forEach(function (player) {
            player.emit('map', _this.game.getField());
        });
        //this.room.emit('map', this.field.getField());
        console.log('game start (' + _this.room_name + ')');
        _this.gameRound();
    };

    this.gameRound = function () {
        _players.current().emit('roll-the-dice');
    };

    this.on('roll-the-dice', function (data, player) {
        if (player.getId() == this.players.current().id) {
            var dice = RANDOM_NUMBER.getRandomDiceValue();
            player.emit('dice-result', dice);
            this.process(dice);
        }
    });

    this.gameOver = function () {
        _this.players.forEach(function (player) {
            player.emit('game-over', _this.players.current().getId());
        });
        //this.room.emit('game-over', this.players.current().getId());
    };

    this.handleQuestion = function (resolve, reject) {

        // TODO: TEST
        resolve();
        return;

        var difficulty;

        //TODO: Check: get difficulty from frontend
        this.players.current().once('set-difficulty', function (data) {

            if (data.isNumber && data == 1 || data == 3 || data == 5) {
                difficulty = data;
            }
            else {
                throw 'Invalid difficulty value from client.';
            }

            // Get question and answers from database.
            var questionObject = _this.getQuestion();
            var correctAnswer = questionObject[0].correctAnswer;

            // Send question and answers to client.
            _this.players.current().emit('question', {
                question: questionObject[1],
                answers: questionObject[2],
                questionImage: questionObject[0].img
            });

            // Get and process question answer from client.
            _this.players.current().once('answer', function (answerId) {

                // Check for correct answer.
                if (answerId.isNumber && answerId === correctAnswer) {
                    _this.players.current().addPosition(difficulty);
                } else {
                    _this.players.current().subPosition(difficulty);
                }
                resolve();
            });
        });

        // No answer is a wrong answer.
        setTimeout(function () {
            _this.players.current().subPosition(difficulty);
            resolve();
        }, 20000);  // 20 seconds.
    };

    // Gets a random question with the appropriate answers.
    this.getQuestion = function (difficulty) {
        var category = _this.game.getCategory();
        var language = _this.players.current().lang;

        return _this.question.getQuestionWithAnswers(category, difficulty, language);
    };

    this.process = function (dice) {
        var pos = this.players.current().addPosition(dice);

        // Check if player has finished the game.
        if (this.game.getField().length > pos - 1) {
            this.gameOver();
            return;
            // Check if player is behind the start field.
        } else if (pos < 0) {
            // Move to start.
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
            var positions = [];
            _players.forEach(function (player) {
                positions[player.getId()] = player.getPosition();
            });
            _this.players.forEach(function (player) {
                player.emit('player-position', positions);
            });
            //_this.room.emit('player-position', positions);
            _this.players.next();
            _this.gameRound();
        }).error(function () {
            throw 'unknown error';
        });
    };

};