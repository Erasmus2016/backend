/**
 * Created by Manuel on 16.02.2017.
 */

// Shuffles the input array and returns it afterwards.
function shuffle(array) {
    let counter = array.length;
    let index;
    let temp;

    // While there are elements in the array.
    while (counter > 0) {
        // Pick a random index.
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1.
        counter--;

        // And swap the last element with it.
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = {
    shuffleAnswers: shuffle,
};