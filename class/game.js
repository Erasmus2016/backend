var Field = require(APPLICATION_PATH + '/playingField/creation/fieldGenerator');

module.exports = function () {
    this.field = Field.generateNewField();
    this.category = null;
    this.availableColors = ['red', 'green', 'blue', 'yellow'];

    this.getField = function () {
        return this.field;
    };

    this.getCategory = function () {
        return this.category;
    };

    this.setCategory = function (category) {
        this.category = category;
    };

    // Returns true, if the color is still available - otherwise false.
    this.IsColorAvailable = function (color) {
        if (this.availableColor.contains(color)) {
            this.availableColor.remove(color);
            return true;
        }
        return false;
    };
};