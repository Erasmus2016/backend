console.log('super');
randomNumber = require('./functions/randomNumber');
var diceResult = randomNumber.getRandomDiceValue();
console.log(diceResult);

generateField = require('./playingField/creation/generateField');
var dummy = generateField.getNewField();

console.log(dummy);