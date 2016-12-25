/**
 * Created by Manuel on 28.11.2016.
 */

function getRandomBoolean(chanceForTrue) {
    return Math.random() < (typeof chanceForTrue !== "undefined" ? chanceForTrue : 0.5);
}

function getRandomNumber(min, max) {
    if (min > max) {
        throw "Can't calculate random: min > max";
    }
    return Math.random() * (max - min) + min;
}

function getRandomInteger(min, max) {
    var result = Math.floor(getRandomNumber(min, max));

    // We don't need this, but better save than sorry.
    if (result >= max) {
        result = max - 1;
    }

    return result;
}

module.exports = {

    // Returns a pseudo random number between 1 and including 6.
    getRandomDiceValue: function () {
        return getRandomInteger(1, 7);
    },

    getRandomBoolean: getRandomBoolean,

    // Returns any random number between min and max (including max)
    getRandomNumber: getRandomNumber,

    // Returns integer random number between min and max (excluding max)
    getRandomInteger: getRandomInteger
};