console.log('super');
randomNumber = require('./functions/randomNumber');
var diceResult = randomNumber.getRandomDiceValue();
console.log(diceResult);

var generateField = require('./playingField/creation/generateField');
var field = generateField.generateNewField();