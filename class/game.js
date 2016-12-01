var Field = require(APPLICATION_PATH + '/playingField/creation/fieldGenerator');
module.exports = function () {
    this.field = Field.generateNewField();

    this.getField = function () {
        return this.field;
    }
};