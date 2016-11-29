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
    //var fieldSize = getFieldSize();
    var test = getFirstField();
    return test;


}

// Returns the size of a playing field.
function getFieldSize() {
    return 128;
}

function getFirstField() {

    var coordinates = [
      [0,1,start], [1,1,standard], [2,1,standard], [3,1,standard], [4,1,standard], [5,1,question], [6,1,standard],
        [6,2,standard], [6,3,standard], [6,4,standard], [6,5,standard], [6,6,question], [6,7,standard], [6,8,standard],
        [6,9,standard], [6,10,standard], [6,11,question], [6,12,standard], [6,13,jump, 8,15], [6,14,standard], [6,15,question],
        [7,15,standard], [8,15,jump, 6,13], [9,15,question], [10,15,standard], [11,15,standard], [12,15,standard],
        [13,15,standard], [13,14,standard], [13,13,question], [13,12,standard], [13,11,standard], [13,10,standard],
        [13,9,question], [13,8,standard], [13,7,standard], [13,6,standard], [13,5,standard], [14,5,question], [15,5,standard],
        [16,5,standard], [17,5,standard], [18,5,question], [19,5,standard], [20,5,standard], [20,6,standard], [20,7,jump, 18,9],
        [19,7,standard], [18,7,standard], [18,8,standard], [18,9,jump, 20,7], [18,10,standard], [18,11,question],
        [18,12,standard], [18,13,question], [18,14,standard], [18,15,standard], [18,16,standard], [19,16,standard],
        [20,16,question], [20,17,jump, 22,19], [20,18,standard], [20,19,standard], [21,19,standard], [22,19,jump, 20,17],
        [23,19,standard], [24,19,question], [25,19,standard], [26,19,standard], [26,18,standard], [26,17,standard],
        [26,16,question], [26,15,standard], [26,14,question], [26,13,standard], [26,12,standard], [26,11,standard],
        [26,10,standard], [26,9,standard], [26,8,question], [26,7,standard], [26,6,question], [27,6,jump, 29,4],
        [28,6,standard], [29,6,standard], [29,5,question], [29,4,jump, 27,6], [29,3,standard],[30,3,standard],
        [31,3,standard], [32,3,standard], [33,3,question], [33,4,standard], [33,5,standard], [33,6,standard], [33,7,question],
        [33,8,standard], [34,8,standard], [35,8,end]
    ];

    // test
    var field = [];
    coordinates.forEach(function (value, key) {
        if (value[2] == jump) {
            var id = -1;
            for (var i = 0; i < coordinates.length; i++) {
                var val = coordinates[i];
                if (val[0] == value[3] && val[1] == value[4]) {
                    id = i;
                    break;
                }
            }
            if (id == -1) {
                throw new Exception("Unable to create playing field.")
            }
            field.push({id:key, x:value[0], y:value[1], type:value[2], jumpDestinationId:id});
            return;
        }
        field.push({id:key, x:value[0], y:value[1], type:value[2]});
    });

    return field;
}

module.exports = {
    getNewField: getNewField
};