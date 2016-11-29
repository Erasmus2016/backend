/**
 * Created by Manuel on 29.11.2016.
 */

var regex = /A-Za-z0-9ÖÄÜäöüß/g;

function CheckData(data) {

    var checkedColor = checkColor(data.Color);
    var checkedLanguage = checkLanguage(data.Language);

    data.Color = checkedColor;
    data.Language = checkedLanguage;

    return data;
}

// Returns the checked color value.
function checkColor(color) {

    if(isStringHarmless(color)) {
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

    if(isStringHarmless(language)) {
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

// Checks if an input string is harmles.
// Returns true if string is harmless - otherwise false.
function isStringHarmless (input) {
    input.forEach(function (value, key) {
        if (regex.test(value)){
            return true;
        }
    });

    return false;
}

// Returns true, if the color is valid - otherwise false.
function isColorValid(color) {

    if(isStringHarmless(color)) {
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

    if(isStringHarmless(language)) {
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