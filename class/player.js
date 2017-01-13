class Player {

    constructor(socket) {
        this.socket = socket;
        this.ready = false;
        this.name = null;
        this.color = null;

        if (!socket.handshake.headers.hasOwnProperty('accept-language'))
            this.lang = 'en';
        else {
            switch (socket.handshake.headers['accept-language'].substr(0, 2).toLowerCase()) {
                case 'de':
                    this.lang = 'de';
                    break;
                case 'cz':
                    this.lang = 'cz';
                    break;
                case 'en':
                default:
                    this.lang = 'en';
            }
        }
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
        return this.socket.id;
    };

    // Returns whether the player is ready or not.
    isReady() {
        return this.ready;
    };

    // Sets the player ready.
    setReady() {
        this.ready = true;
    };

    // Sets the player as not ready.
    setNotReady() {
        this.ready = false;
    };

    // Returns the name of the player.
    getName() {
        return this.name;
    };

    // Sets the name for the player.
    setName(name) {
        this.name = name;
    };

    // Returns the color of the player.
    getColor() {
        return this.color;
    };

    // Sets the color for the player.
    setColor(color) {
        this.color = color;
    };

    // Returns the language of the player.
    getLanguage() {
        return this.lang;
    };

    // Sets the language for the player.
    setLanguage(language) {
        this.lang = language;
    };

    emit(event, data) {
        this.socket.emit(event, data);
    };
}

module.exports = Player;