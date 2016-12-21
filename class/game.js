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
        if (this.availableColors.indexOf(color) !== -1) {

            this.availableColors.(color);
            return true;
        }
        return false;
    }

    getAllAvailableColors() {
        return this.availableColors;
    }

}

module.exports = Game;