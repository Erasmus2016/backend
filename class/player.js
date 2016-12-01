module.exports = function (socket) {
    this.socket = socket;
    this.isReady = false;
    this.id = socket.id;
    this.name = null;
    this.color = null;
    this.lang = 'en';

    this.position = 0;

    this.setPosition = function (position) {
        return this.position = position
    };

    this.addPosition = function (add) {
        return this.position += add;
    };

    this.subPosition = function (add) {
        return this.position -= add;
    };

    this.getPosition = function () {
        return this.position;
    };

    this.getSocket = function () {
        return this.socket;
    };

    this.getId = function () {
        return this.id;
    };

    this.emit = function (data) {
        this.socket.emit(data);
    };
};