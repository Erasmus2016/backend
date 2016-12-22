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

    // Returns whether the player is ready or not.
    isPlayerReady = function () {
        return this.isReady;
    };

    // Sets the player ready.
    setPlayerReady = function () {
        this.isReady = true;
    };

    // Sets the player as not ready.
    setPlayerNotReady = function () {
        this.isReady = false;
    };

    // Returns the name of the player.
    getPlayerName = function () {
        return this.name;
    };

    // Sets the name for the player.
    setPlayerName = function (name) {
        this.name = name;
    };

    // Returns the color of the player.
    getPlayerColor = function () {
        return this.color;
    };

    // Sets the color for the player.
    setPlayerColor = function (color) {
        this.color = color;
    };

    // Returns the language of the player.
    getPlayerLanguage = function () {
        return this.lang;
    };

    // Sets the language for the player.
    setPlayerLanguage = function (language) {
        this.lang = language;
    };

    emit = function (event, data) {
        this.socket.emit(event, data);
    };
}

module.exports = Player;