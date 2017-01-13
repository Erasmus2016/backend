//TODO: set category on game class on game init.

const Game = require(APPLICATION_PATH + '/class/game'),
    Player = require(APPLICATION_PATH + '/class/player'),
    Question = require(APPLICATION_PATH + '/class/question'),
    Validator = require('../functions/validator'),
    RandomNumber = require('../functions/randomNumber');

module.exports = function (io, sockets) {
    this.players = [];
    this.game = new Game();
    this.question = new Question();

    this.players.next = function () {
        if (this.currentI + 1 == this.length)
            return this[this.currentI = 0];
        return this[++this.currentI];
    };
    this.players.current = function () {
        return this[this.currentI];
    };
    this.players.forEach = function (callback) {
        for (let i = 0; i < this.length; i++)
            callback(this[i], i, this);
    };

    this.players.currentI = 0;
    this.room_name = 'ROOM_' + (++ROOM_COUNT);
    this.room = io.sockets.in(this.room_name);

    sockets.forEach((socket) => {
        this.players.push(new Player(socket));
        socket.join(this.room_name);
    });

    console.log('new room (' + this.room_name + ')');

    this.room.emit('login');
    this.broadcast = (event, data) => {
        io.sockets.in(this.room_name).emit(event, data);
    };
    this.on = (event, callback) => {
        this.players.forEach((player) => {
            player.getSocket().on(event, (data) => {
                callback(data, player);
            });
        });
    };

    // Will be triggered on login action.
    // Map user (player) input to player object.
    this.on('login', (data, player) => {

        console.log(data);
        //todo remove language validator
        if (!Validator.isColorValid(data.color) || !Validator.isLanguageValid(data.lang)
            || !Validator.isCategoryValid(data.category) || !Validator.isStringHarmless(data.name)) {
            throw "Invalid data (color, category, name or language) from client.";
        }

        player.lang = data.lang;
        player.name = data.name;
        // TODO: Logic bug: The last player changes the category for all players in this game.
        this.game.setCategory(data.category);

        // Check if player color is still available.
        if (this.game.isColorAvailable(data.color)) {
            player.color = data.color;

            this.sendAvailableColorsToAllClients();
            player.isReady = true;
            this.checkReady();
        }
    });

    // Sends all available colors to all players (clients).
    this.sendAvailableColorsToAllClients = () => {
        this.broadcast('room', this.room_name);
        this.broadcast('available-colors', this.game.getAllAvailableColors());
    };

    // Checks if all players within a game are ready.
    // If so, send all players the game field (map) and trigger first game round.
    this.checkReady = () => {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].isReady)
                return false;
        }

        this.broadcast('map', this.game.getField());

        console.log('game start (' + this.room_name + ')');
        this.gameRound();
    };

    // The current player will be notified to role the dice.
    this.gameRound = () => {
        this.players.current().emit('roll-the-dice');

        // Handles the dice role action.
        this.players.current().getSocket().once('roll-the-dice', () => {
            const dice = RandomNumber.getRandomDiceValue();
            this.players.current().getSocket().emit('dice-result', dice);
            this.process(dice);
        });
    };


    // Handles the end of game action. Sends the id of the winner player.
    this.gameOver = () => {
        this.broadcast('game-over', this.players.current().getId());
    };

    // Handles the question logic.
    this.handleQuestion = (resolve, reject) => {

        // TODO: TEST
        let difficulty;

        //TODO: Check: Get difficulty from frontend.
        // Get player difficulty value for a question.
        this.players.current().once('set-difficulty', (data) => {

            if (data.isNumber && (data == 1 || data == 3 || data == 5)) {
                difficulty = data;
            }
            else {
                throw 'Invalid difficulty value from client.';
            }

            // Get a question with its appropriate answers from database.
            let questionObject = this.getQuestion(difficulty);
            let correctAnswerId = questionObject[0].correctAnswer;

            // Send question and answers to client. Also send the image for this question.
            this.players.current().emit('question', {
                question: questionObject[1],
                answers: questionObject[2],
                questionImage: questionObject[0].img
            });

            // Get and process question answer from client.
            this.players.current().once('answer', (answerId) => {

                // Check for correct answer and move player appropriate.
                if (answerId.isNumber && answerId === correctAnswerId) {
                    this.players.current().addPosition(difficulty);
                } else {
                    this.players.current().subPosition(difficulty);
                }
                resolve();
            });
        });

        // No answer is a wrong answer.
        setTimeout(() => {
            this.players.current().subPosition(difficulty);
            resolve();
        }, 20000);  // 20 seconds.
    };

    // Gets a random question with the appropriate answers from database.
    this.getQuestion = (difficulty) => {
        const gameCategory = this.game.getCategory();
        const userLanguage = this.players.current().lang;

        // TODO: Testing this call.
        return this.question.getQuestionWithAnswers(gameCategory, difficulty, userLanguage).then((result) => {
            console.log("Result from database call: " + result);
        });
    };

    // Moves the player to a new position on the playing field (map).
    this.process = (dice) => {
        let pos = this.players.current().addPosition(dice);

        // Check if the player has finished the game.
        if (this.game.getField().length < pos - 1) {
            this.gameOver();
            return;
            // Check if the player is behind the start field.
        } else if (pos < 0) {
            // Move to start.
            this.players.current().setPosition(0);
        }

        let step = this.game.getField()[pos];

        // Check the new position of the player and deals with special fields.
        const promise = new Promise((resolve, reject) => {
            switch (step.type) {
                case 'default':
                    resolve();
                    break;
                case 'question':
                    this.handleQuestion(resolve, reject);
                    break;
                case 'jump':
                    this.players.current().setPosition(step.jumpDestinationId);
                    resolve();
                    break;
                default:
                    reject('unknown field type');
            }
        });

        // Notify all players with the new position of all players.
        promise.then(() => {
            const positions = [];
            this.players.forEach((player) => {
                positions[player.getId()] = player.getPosition();
            });
            this.broadcast('player-position', positions);

            // It's the next players turn.
            this.players.next();
            this.gameRound();
        }).catch(() => {
            throw 'unknown error';
        });
    };

};