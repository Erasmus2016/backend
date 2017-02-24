const Field = require('../field/fieldGenerator');

class Game {

    constructor(category) {
        // Generate new playing field while creating this object.
        this.field = Field.generateNewField();
        this.category = category;
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
        if (this.category === undefined) {
            this.category = category;
        }
    };

    // Returns true, if the color is still available - otherwise false.
    // Logic: Removes the checked color from array due to the fact, that every player has to have an unique color.
    isColorAvailable(newColor) {
        const newColorIndex = this.getIndexOfColor(newColor);

        if (newColorIndex !== -1) {
            this.availableColors.splice(newColorIndex, 1);
            return true;
        }
        return false;
    };

    // Adds an old color to the available colors array if any.
    releaseOldColorIfAny(oldColor) {
        const oldColorIndex = this.getIndexOfColor(oldColor);

        if (typeof oldColor !== 'undefined' && oldColorIndex === -1) {
            this.availableColors.push(oldColor);
        }
    }

    // Returns the index of the input color from the available colors array as an integer.
    // Returns -1 if the input color doesn't exist.
    getIndexOfColor(color) {
        return this.availableColors.indexOf(color);
    }

    // Returns an array with all remaining colors left.
    getAllAvailableColors() {
        return this.availableColors;
    };
}

module.exports = Game;