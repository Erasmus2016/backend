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
    };

    // Sets the players position.
    setPosition(position) {
        return this.position = position;
    };

    // Moves the players position ahead.
    addPosition(add) {
        return this.position += add;
    };

    // Moves the players position behind.
    subPosition(remove) {
        return this.position -= remove;
    };

    // Returns the current players position.
    getPosition() {
        return this.position;
    };

    // Returns the socket.
    getSocket() {
        return this.socket;
    };

    // Returns the socket id.
    getId() {
        return this.socketId;
    };

    // Returns whether the player is ready or not.
    isPlayerReady() {
        return this.isReady;
    };

    // Sets the player ready.
    setPlayerReady() {
        this.isReady = true;
    };

    // Sets the player as not ready.
    setPlayerNotReady() {
        this.isReady = false;
    };

    // Returns the name of the player.
    getPlayerName() {
        return this.name;
    };

    // Sets the name for the player.
    setPlayerName(name) {
        this.name = name;
    };

    // Returns the color of the player.
    getPlayerColor() {
        return this.color;
    };

    // Sets the color for the player.
    setPlayerColor(color) {
        this.color = color;
    };

    // Returns the language of the player.
    getPlayerLanguage() {
        return this.lang;
    };

    // Sets the language for the player.
    setPlayerLanguage(language) {
        this.lang = language;
    };

    emit(event, data) {
        this.socket.emit(event, data);
    };
}

module.exports = Player;