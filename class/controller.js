//TODO: set category on game class on game init.


var Game = require(APPLICATION_PATH + '/class/game');
var Player = require(APPLICATION_PATH + '/class/player');
//var Question = require(APPLICATION_PATH + '/class/question');

module.exports = function (io, sockets) {
    var _this = this;
    this.game = new Game();
    this.players = [];
    this.question = new Question();
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
            throw "Invalid data (color or language) from client.";

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
        this.room.emit('map', this.field.getField());
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

        // TODO: TEST
        resolve();
        return;

        var difficulty;

        //TODO: Check: get difficulty from frontend
        this.players.curent().once('set-difficulty', function (data) {

            if (data.isNumber && data == 1 || data == 3 || data == 5) {
                difficulty = data;
            }
            else {
                throw 'Invalid difficulty value from client.';
            }

            // Get question and answers from database.
            var questionObject = _this.getQuestion();
            var correctAnswer = questionObject[0].correctAnswer;

            _this.players.current().emit('question', {
                question: questionObject[1],
                answers: questionObject[2],
                questionImage: questionObject[0].img
            });

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
            var positions = [];
            players.forEach(function (player) {
                positions[player.getId()] = player.getPosition();
            });
            _this.room.emit('player-position', positions);
            _this.players.next();
            _this.gameRound();
        }).error(function () {
            throw 'unknown error';
        });
    };

};