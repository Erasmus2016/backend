/**
 * Created by Manuel on 28.11.2016.
 */

module.exports = {

    // Returns a pseudo random number between 1 and including 6.
    getRandomDiceValue: function () {
        var min = 1;
        var max = 7;
        var randomNumber = Math.floor(Math.random() * (max - min) + min);

        // Make sure our random number is not the maximum value. If so decrease it by one.
        return (randomNumber == max)
            ? max--
            : randomNumber;
    },

    getRandomBoolean: function () {
        return Math.random() >= 0.5;
    }
};