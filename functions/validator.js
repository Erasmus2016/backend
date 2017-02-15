/**
 * Created by Manuel on 29.11.2016.
 */

// Regular expression for user input validation (XSS).
// Allowed characters: A-Z a-z 0-9 _ and German and Czech special characters.
const regex = /^[\wäöüßáčďéěíňóřšťúůýž]+$/i;

// Gets and checks an input data object and returns a checked version.
function checkData(data) {

    const checkedColor = checkColor(data.Color);
    const checkedLanguage = checkLanguage(data.Language);

    data.Color = checkedColor;
    data.Language = checkedLanguage;

    return data;
}

// Returns the checked color value or otherwise false.
function checkColor(color) {

    if(!isStringHarmless(color)) {
        throw "Color value is potential dangerous.";
    }

    switch (color) {
        case "green":
        case "red":
        case "blue":
        case "yellow":
            return color;
        default:
            return false;
    }
}

// Returns the checked language value or 'en' as a default value.
function checkLanguage(language) {

    if(!isStringHarmless(language)) {
        throw "Language value is potential dangerous.";
    }

    switch (language) {
        case "en":
        case "de":
        case "cz":
            return language;
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

// Returns true, if the category name is valid.
function isCategoryValid(category) {
    if (!isStringHarmless(category)) {
        throw "Category value is potential dangerous.";
    }
    return true;
}

// Checks if an input string is harmless.
// Returns true if string is harmless - otherwise false.
function isStringHarmless (input) {
     return regex.test(input);
}

module.exports = {
    isLanguageValid: isLanguageValid,
    isColorValid: isColorValid,
    isCategoryValid: isCategoryValid,
    isStringHarmless: isStringHarmless,
    checkData: checkData
};