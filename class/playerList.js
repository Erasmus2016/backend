class PlayerList {
    constructor() {
        this.players = {};
        this.curr = 0;
    }

    add(player) {
        this.players[player.getId()] = player;
    }

    get(id) {
        return this.players[id];
    }

    index(index){
        return this.players[Object.keys(this.players)[index]];
    }

    remove(id) {
        delete this.players[id];
    }

    next() {
        this.curr = (this.curr + 1 == this.size()) ? 0 : this.curr + 1;
        return this.current();
    }

    current() {
        return this.players[Object.keys(this.players)[this.curr]];
    }

    size() {
        return Object.keys(this.players).length;
    }

    each(callback) {
        for (let key in this.players) {
            if (this.players.hasOwnProperty(key))
                callback(this.players[key], key, this.players);
        }
    };
}

module.exports = PlayerList;