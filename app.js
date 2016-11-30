console.log('super');
randomNumber = require('./functions/randomNumber');
var diceResult = randomNumber.getRandomDiceValue();
console.log(diceResult);

var generateField = require('./playingField/creation/fieldGenerator');
var field = generateField.generateNewField();

var test = require('./functions/validator/dataChecker.js');
var test2 = test.isColorValid("green");
var test3 = test.isLanguageValid("en");

console.log(test2);
console.log(test3);