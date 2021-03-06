//TODO: set category on game class on game init.

const EventEmitter = require('events'),
    Game = require('./game'),
    Player = require('./player'),
    Question = require('./question'),
    Validator = require('../functions/validator'),
    RandomNumber = require('../functions/randomNumber'),
    {log} = require('../functions'),
    PlayerList = require('./playerList');

class Controller extends EventEmitter {
    constructor(io, id, db) {

        // Must call super for "this" to be defined.
        super();

        this._id = id;
        this._io = io;
        this.game = new Game('history');
        this._question = new Question(db);
        this.players = new PlayerList();
        this.room_name = 'ROOM_' + this._id;
        this.room = this._io.sockets.in(this.room_name);

        log('new room (' + this.room_name + ')', 'green');
    }

    // Adds a new player to the players list.
    addPlayer() {
        for (let key in arguments) {
            if (!arguments.hasOwnProperty(key))
                continue;

            let player = new Player(arguments[key]);
            player.getSocket().join(this.room_name);
            this.players.add(player);

            // Set socket events.
            player.getSocket().on('login', (data) => {

                if (!Validator.isColorValid(data.color) || !Validator.isCategoryValid(data.category) || !Validator.isStringHarmless(data.name)) {
                    throw "Invalid data (color, category or name) from client.";
                }

                player.setName(data.name);

                // Only the first player can set the category. All following players can't change the category.
                // TODO: Send all following players the category and notify them that there are unable to change the category.
                // TODO: Alternate check for the same category before adding a new player to a room. Only move players with the same category to the same room.
                //this.game.setCategory(data.category);

                this.game.releaseOldColorIfAny(player.getColor());

                // Check if player color is still available.
                if (this.game.isColorAvailable(data.color)) {
                    player.setColor(data.color);

                    this.sendAvailableColorsToAllClients();
                    player.setReady();
                    this.checkReady();
                }
            }).on('disconnect', () => {
                this.players.remove(player.getId());
                this.emit('disconnect');
            });
        }

        setTimeout(() => {
            this.room.emit('login');
        }, 1000);   // 1 second.
    }

    // Sends all available colors to all players (clients).
    sendAvailableColorsToAllClients() {
        this.broadcast('room', this.room_name);
        this.broadcast('available-colors', this.game.getAllAvailableColors());
    }

    // Checks if all players within a game are ready.
    // If so, send all players the game field (map) and trigger first game round.
    checkReady() {
        for (let i = 0; i < this.players.size(); i++) {
            if (!this.players.index(i).isReady())
                return false;
        }

        this.broadcast('map', this.game.getField());
        this.broadcastPlayerPositions();

        log('game start (' + this.room_name + ')');
        this.gameRound();
    }

    // The current player will be notified to role the dice.
    gameRound() {
        this.players.current().emit('roll-the-dice');

        // Handles the dice role action.
        this.players.current().getSocket().once('roll-the-dice', () => {
            const dice = RandomNumber.getRandomDiceValue();
            this.players.current().getSocket().emit('dice-result', dice);
            this.process(dice);
        });
    }

    // Moves the player to a new position on the playing field (map).
    process(dice) {
        let pos = this.players.current().addPosition(dice);

        // Check if the player has finished the game.
        if (this.game.getField().length < pos) {
            // Send the new positions to all players before dealing with the game over handling.
            this.setCurrentPlayerToSpecificPosition(this.game.getField().length - 1);
            this.broadcastPlayerPositions();
            this.gameOver();
            return;
            // Check if the player is behind the start field.
        } else if (pos < 0) {
            // Move to start.
            this.setCurrentPlayerToSpecificPosition(1);
        }

        // Send the new positions to all players before dealing with the new field type.
        this.broadcastPlayerPositions();

        let step = this.game.getField()[pos];

        // Check the new position of the player and deal with special fields.
        const promise = new Promise((resolve, reject) => {
            switch (step.type) {
                case 'default':
                    resolve();
                    break;
                case 'question':
                    this.handleQuestion(resolve);
                    break;
                case 'jump':
                    // Wait 2 seconds before moving the player's position to the new field.
                    setTimeout(() => {
                        this.setCurrentPlayerToSpecificPosition(step.jumpDestinationId);
                        resolve();
                    }, 2000);
                    break;
                default:
                    reject('Unknown field type.');
            }
        });

        // Notify all players with the new position of all players.
        promise.then(() => {
            this.broadcastPlayerPositions();

            // It's the next players turn.
            this.players.next();
            this.gameRound();
        }).catch((e) => {
            console.log(e);
            throw 'Unknown error!';
        });
    }

    // Moves the current player's position to the passed field id.
    setCurrentPlayerToSpecificPosition(jumpDestinationId) {
        this.players.current().setPosition(jumpDestinationId);
    }

    // Sends to all players the current position and selected color for all players.
    broadcastPlayerPositions() {
        const positions = {};

        this.players.each((player) => {
            positions[player.getId()] = {
                color: player.getColor(),
                position: player.getPosition()
            };
        });

        this.broadcast('player-position', positions);
    }

    // Handles the end of game action. Sends the id of the winner player.
    gameOver() {
        this.broadcast('game-over', this.players.current().getId());
    }

    // Handles the question logic.
    handleQuestion(resolve) {
        let difficulty = 3;
        let correctAnswerId = 0;

        //TODO: Check: Get difficulty from frontend.
        // Get player difficulty value for a question.
        this.players.current().getSocket().emit('set-difficulty');
        this.players.current().getSocket().once('set-difficulty', (data) => {
            if (!isNaN(data) && (data == 1 || data == 2 || data == 3)) {
                difficulty = data;
            }
            else {
                throw 'Invalid difficulty value from client.';
            }

            // Get a question with its appropriate answers from the database.
            this.getQuestion(difficulty).then((questionObject) => {
                correctAnswerId = questionObject[0].answer;

                const map = questionObject[2].map(answer => {
                    return answer.id;
                });

                // Send translated question and answers to the client.
                // Also send the link to the image for this question.
                this.players.current().getSocket().emit('question', {
                    question: questionObject[1],
                    answers: questionObject[2].map(answer => {
                        return answer.content;
                    }),
                    image: 'https://questions.barmania.eu/image/' + questionObject[0].id
                });

                // Get and process question answer from client.
                this.players.current().getSocket().once('answer', (answerId) => {

                    // Check for correct answer and move player appropriate.
                    if (!isNaN(answerId) && map[answerId] === correctAnswerId) {
                        this.players.current().addPosition(Controller.mapDifficultyToStep(difficulty));
                    } else {
                        this.players.current().subPosition(Controller.mapDifficultyToStep(difficulty));
                    }

                    for (let i in map) {
                        if (map.hasOwnProperty(i)) {
                            if (map[i] == correctAnswerId) {
                                // Send the player the correct answer id for this very question.
                                this.players.current().getSocket().emit('correct-answer', i);
                            }
                        }
                    }

                    resolve();
                });
            }).catch((e) => {
                console.log(e);
            });
        });

        // No answer is a wrong answer.
        setTimeout(() => {
            try {
                this.players.current().getSocket().removeAllListeners('set-difficulty');
                this.players.current().getSocket().removeAllListeners('answer');
                this.players.current().getSocket().emit('correct-answer', correctAnswerId);
                this.players.current().subPosition(Controller.mapDifficultyToStep(difficulty));
            } catch (e) {

            }

            resolve();
        }, 60000);  // 60 seconds.
    }

    // Gets a random question with the appropriate answers from database.
    getQuestion(difficulty) {
        //const gameCategory = /*this.game.getCategory().toLowerCase()*/'history';
        const gameCategory = this.game.getCategory();
        const userLanguage = this.players.current().lang;

        return this._question.getQuestionWithAnswers(gameCategory, difficulty, userLanguage);
    }

    // Sends the input data with the appropriate event name to all connected clients within this room.
    broadcast(event, data) {
        this._io.sockets.in(this.room_name).emit(event, data);
    }

    // Returns the id (GUID) of this controller.
    getId() {
        return this._id;
    }

    // Gets the player selected difficulty value and returns the difficulty value for the map.
    static mapDifficultyToStep(difficulty) {
        switch (difficulty) {
            case 1:
                return 1;
            case 2:
                return 3;
            case 3:
                return 5;
            default:
                throw "Invalid difficulty value passed.";
        }
    }
}

module.exports = Controller;