const Field = require(APPLICATION_PATH + '/field/fieldGenerator');

class Game {

    constructor() {
        this.field = Field.generateNewField();
        this.category = null;
        this.availableColors = ['red', 'green', 'blue', 'yellow'];
    };

    // Returns the playing field for the current game.
    getField() {
        return this.field;
    };

    // Returns the category for this game.
    getCategory() {
        return this.category;
    };

    // Sets the category for this game.
    // TODO: What happens, if there is a game category change while playing?
    setCategory(category) {
        this.category = category;
    };

    // Returns true, if the color is still available - otherwise false.
    // Logic: Removes the checked color from array due to the fact, that every player has to have an unique color.
    isColorAvailable(color) {
        var index = this.availableColors.indexOf(color);

        if (index !== -1) {
            this.availableColors.splice(index, 1);
            return true;
        }
        return false;
    };

    // Returns an array with all remaining colors left.
    getAllAvailableColors() {
        return this.availableColors;
    };
}

module.exports = Game;