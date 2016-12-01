/**
 * Created by Manuel on 29.11.2016.
 */

var regex = /A-Za-z0-9ÖÄÜäöüß/g;

// Gets and checks an input data objects and returns a checked version.
function checkData(data) {

    var checkedColor = checkColor(data.Color);
    var checkedLanguage = checkLanguage(data.Language);

    data.Color = checkedColor;
    data.Language = checkedLanguage;

    return data;
}

// Returns the checked color value.
function checkColor(color) {

    if(!isStringHarmless(color)) {
        throw "Color value is potential dangerous.";
    }

    switch (color) {
        case "green":
            return "green";
        case "red":
            return "red";
        case "blue":
            return "blue";
        case "yellow":
            return "yellow";
        default:
            return false;
    }
}

// Returns the checked language value.
function checkLanguage(language) {

    if(!isStringHarmless(language)) {
        throw "Language value is potential dangerous.";
    }

    switch (language) {
        case "en":
            return "en";
        case "de":
            return "de";
        case "cz":
            return "cz";
        default:
            return "en";
    }
}

// Returns true, if the color is valid - otherwise false.
function isColorValid(color) {

    if(!isStringHarmless(color)) {
        throw "Color value is potential dangerous.";
    }

    switch (color) {
        case "green":
        case "red":
        case "blue":
        case "yellow":
            return true;
        default:
            return false;
    }
}

// Returns true, if the language is valid - otherwise false.
function isLanguageValid(language) {

    if(!isStringHarmless(language)) {
        throw "Language value is potential dangerous.";
    }

    switch (language) {
        case "en":
        case "de":
        case "cz":
            return true;
        default:
            return false;
    }
}

function isCategoryValid(category) {
    if (!isStringHarmless(category)) {
        throw "Category value is potential dangerous.";
    }
}

// Checks if an input string is harmless.
// Returns true if string is harmless - otherwise false.
function isStringHarmless (input) {

    for (var i = 0; i < input.length; i++) {
        if (regex.test(input[i])) {
            return false;
        }
    }

    return true;
}

module.exports = {
    isLanguageValid: isLanguageValid,
    isColorValid: isColorValid,
    checkData: checkData
};