const Field = require(APPLICATION_PATH + '/playingField/creation/fieldGenerator');

class Game {

    constructor() {
        this.field = Field.generateNewField();
        this.category = null;
        this.availableColors = ['red', 'green', 'blue', 'yellow'];
    }

    getField() {
        return this.field;
    }

    getCategory() {
        return this.category;
    }

    setCategory(category) {
        this.category = category;
    }

    // Returns true, if the color is still available - otherwise false.
    isColorAvailable(color) {
        var index = this.availableColors.indexOf(color);

        if (index !== -1) {
            this.availableColors.splice(index, 1);
            return true;
        }
        return false;
    }

    // Returns an array with all remaining colors left.
    getAllAvailableColors() {
        return this.availableColors;
    }
}

module.exports = Game;