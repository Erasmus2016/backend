var Field = require(APPLICATION_PATH + '/playingField/creation/fieldGenerator');
module.exports = function () {
    this.field = Field.generateNewField();
    this.category = null;

    this.getField = function () {
        return this.field;
    };

    this.getCategory = function () {
        return this.category;
    };

    this.setCategory = function (category) {
        this.category = category;
    }
};