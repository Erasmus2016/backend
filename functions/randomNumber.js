/**
 * Created by Manuel on 28.11.2016.
 */

function getRandomBoolean() {
    return Math.random() >= 0.5;
}

function getRandomNumber(min, max) {
    if (min > max) throw new Exception("Can't calculate random: min > max");
    return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
    var result = Math.floor(getRandomNumber(min, max));
    if (result >= max) result = max - 1;
    return result;
}

module.exports = {

    // Returns a pseudo random number between 1 and including 6.
    getRandomDiceValue: function () {
        return getRandomNumber(1, 7);
    },

    getRandomBoolean: getRandomBoolean,

    // Returns any random number between min and max (including max)
    getRandomNumber: getRandomNumber,

    // Returns integer random number between min and max (excluding max)
    getRandomInteger: getRandomInteger
};