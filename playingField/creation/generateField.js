/**
 * Created by Manuel on 28.11.2016.
 */

var start = "start";
var end = "end";
var standard = "default";
var question = "question";
var jump = "jump";

// This functions will generate the playing field and return it.
function getNewField() {
    var fieldSize = getFieldSize();


}

// Returns the size of a playing field.
function getFieldSize() {
    return 128;
}

function getFirstField() {

    var coordinates = [
      [0,1,start], [1,1,standard], [2,1,standard], [3,1,standard], [4,1,standard], [5,1,question], [6,1,standard],
        [6,2,standard], [6,3,standard], [6,4,standard], [6,5,standard], [6,6,question], [6,7,standard], [6,8,standard],
        [6,9,standard], [6,10,standard], [6,11,question], [6,12,standard], [6,13,jump, "8,15"], [6,14,standard], [6,15,question],
        [7,15,standard], [8,15,jump, "6,13"], [9,15,question], [10,15,standard], [11,15,standard], [12,15,standard],
        [13,15,standard], [13,14,standard], [13,13,question],
    ];

    // test
    var field = [];
    coordinates.forEach(function (value, key) {
        field.push({id:key, x:value[0], y:value[1], type:value[2]})
    });

    var field1 = getStartField();
    var field2 = getRegularField(1,1);
    var field3 = getRegularField();

    var playingFieldArray = new array();
}

function getStartField() {
    return {x:0, y:1, type:"start"};
}

function getEndField() {
    return {x:35, y:8, type:"finish"};
}

function getRegularField(xCoord, yCoord) {
    return {x:xCoord, y:yCoord, type:"default"};
}