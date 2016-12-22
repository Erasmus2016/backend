class Player {

    constructor(socket) {
        this.socket = socket;
        this.isReady = false;

        // TODO: Check if still necessary or direct usage of this.socket.id.
        this.socketId = socket.id;
        this.name = null;
        this.color = null;
        this.lang = 'en';
        this.position = 0;
    }

    // Sets the players position.
    setPosition = function (position) {
        return this.position = position;
    };

    // Moves the players position ahead.
    addPosition = function (add) {
        return this.position += add;
    };

    // Moves the players position behind.
    subPosition = function (remove) {
        return this.position -= remove;
    };

    // Returns the current players position.
    getPosition = function () {
        return this.position;
    };

    // Returns the socket.
    getSocket = function () {
        return this.socket;
    };

    // Returns the socket id.
    getId = function () {
        return this.socketId;
    };

    isPlayerReady = function () {
        return this.isReady;
    };

    setPlayerReady = function () {
        this.isReady = true;
    };

    setPlayerNotReady = function () {
        this.isReady = false;
    };

    getPlayerName = function () {
        return this.name;
    };

    setPlayerName = function (name) {
        this.name = name;
    };

    getPlayerColor = function () {
        return this.color;
    };

    setPlayerColor = function (color) {
        this.color = color;
    };

    getPlayerLanguage = function () {
        return this.lang;
    };

    setPlayerLanguage = function (language) {
        this.lang = language;
    };

    emit = function (event, data) {
        this.socket.emit(event, data);
    };
}

module.exports = Player;