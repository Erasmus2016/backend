/**
 * Created by Manuel on 28.11.2016.
 */

// var start = "start"; // FIXME: on table wasn't start type (it isn't required)
// var end = "end"; // FIXME: on table wasn't end type (it isn't required)
var standard = "default";
var question = "question";
var jump = "jump";

function drawFieldToString(field) {//TODO: create utils.js and move methods like this there
    var maxX = 0, maxY = 0;
    field.forEach(function (val) {
        maxX = Math.max(maxX, val.x);
        maxY = Math.max(maxY, val.y);
    });

    var fieldMap = [];
    for (var x = 0; x < maxX + 1; x++) {
        var line = [];
        for (var y = 0; y < maxY + 1; y++) {
            line.push('  ');
        }
        fieldMap.push(line);
    }
    field.forEach(function (val) {
        var typeMark;
        switch (val.type) {
            /*case start:
             typeMark = 'S ';
             break;
             case end:
             typeMark = 'E ';
             break;*/
            case standard:
                typeMark = 'O ';
                break;
            case question:
                typeMark = '! ';
                break;
            case jump:
                typeMark = '> ';
                break;
            default:
                typeMark = 'X ';// unknown tile
                break;
        }
        fieldMap[val.x][val.y] = typeMark;
    });

    var result = "fieldLen=" + field.length + ", maxX=" + maxX + ", maxY=" + maxY;
    for (var mapY = 0; mapY < fieldMap[0].length; mapY++) {
        result += "\n";
        for (var mapX = 0; mapX < fieldMap.length; mapX++) {
            result += fieldMap[mapX][mapY];
        }
    }
    return result;
}

function getRandomBoolean() {//TODO: create utils.js and move methods like this there
    return Math.random() >= 0.5;
}

function generateField(maxX, maxY, approximateLength) {//TODO: split to more methods
    var startX = 0, startY = Math.floor(Math.random() * maxY);
    var requiredSizeAddition = approximateLength - maxX;
    if (requiredSizeAddition <= 0) {
        // generate line map (too short length required)
        var field = [];
        for (var i = startX; i < approximateLength + startX; i++) {
            field.push({id: i - startX, x: i, y: startY, type: standard});
        }
        return field;
    }

    var exactPathLength = true;// true == resulting path will have exact length, false == resulting path will be the longest as is possible
    var startWave = getRandomBoolean(), nextWave = startWave;// false == up wave, true == down wave
    var maxOneUpWaveAddition = startY;
    var maxOneDownWaveAddition = maxY - startY;
    var maxWaves = (maxX - 3) / 2;
    var minWaves = 0;

    var tempLength = maxX;
    while (tempLength < approximateLength) {
        minWaves++;
        if (nextWave) {
            tempLength += maxOneDownWaveAddition;
        } else {
            tempLength += maxOneUpWaveAddition;
        }
        nextWave = !nextWave;
    }

    if (minWaves > maxWaves) {// reduce number of waves (resulting map will be smaller then required length)
        exactPathLength = false;
        minWaves = maxWaves;
    } else if (minWaves < maxWaves) {// if (minWaves == maxWaves) do nothing
        var addOneMoreWave = getRandomBoolean();// this variable is created here only for better code readability
        if (addOneMoreWave) {
            minWaves++;
            if (nextWave) {
                tempLength += maxOneDownWaveAddition;
            } else {
                tempLength += maxOneUpWaveAddition;
            }
            nextWave = !nextWave;
        }
    }

    var wavesNum = minWaves;
    var availableStraightTiles = maxX - (wavesNum * 2);
    var straightTilesSizes = new Array((wavesNum * 2) + 1);
    straightTilesSizes.fill(0);

    if (availableStraightTiles > 0) {// prefer to add 1 tile to start
        availableStraightTiles--;
        straightTilesSizes[0]++;
    }

    if (availableStraightTiles > 0) {// prefer to add 1 tile to start
        availableStraightTiles--;
        straightTilesSizes[0]++;
    }

    if (availableStraightTiles > 0) {// prefer to add 1 tile to end
        availableStraightTiles--;
        straightTilesSizes[straightTilesSizes.length - 1]++;
    }

    while (availableStraightTiles > 0) {
        var targetSpace = Math.floor(Math.random() * straightTilesSizes.length);
        availableStraightTiles--;
        straightTilesSizes[targetSpace]++;
    }

    var requiredWavesSize = requiredSizeAddition;
    var wavesBranchesSizes = new Array(wavesNum * 2);
    wavesBranchesSizes.fill(0);

    if (exactPathLength) {
        while (requiredWavesSize > 0) {
            var targetWavesBranch = Math.floor(Math.random() * wavesBranchesSizes.length);
            var wavePosition = startY;
            var addNextBranchToPosition = wavesBranchesSizes.length - 1 > targetWavesBranch && targetWavesBranch % 2 != 0;
            for (var i = 0, end = targetWavesBranch + (addNextBranchToPosition ? 1 : 0); i <= end; i++) {
                var way = 1;
                if (i % 2 == 0) way *= -1;
                if (Math.floor(i / 2) % 2 != 0) way *= -1;
                if (startWave) way *= -1;

                wavePosition += wavesBranchesSizes[i] * way;
            }

            var way = 1;
            if (targetWavesBranch % 2 == 0) way *= -1;
            if (Math.floor(targetWavesBranch / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            var newWaveBranchSize = wavesBranchesSizes[targetWavesBranch] + 1;

            if (wavePosition + (newWaveBranchSize * way) < 0
                || wavePosition + (newWaveBranchSize * way) >= maxY) continue;

            wavesBranchesSizes[targetWavesBranch] = newWaveBranchSize;
            requiredWavesSize--;
        }
    } else {
        var wavePosition = startY;
        for (var i = 0; i < wavesBranchesSizes.length; i++) {
            var way = 1;
            if (i % 2 == 0) way *= -1;
            if (Math.floor(i / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            var newBranchSize = wavesBranchesSizes[i] * way;
            while (true) {
                var newSize = newBranchSize + way;
                if (wavePosition + newSize < 0 || wavePosition + newSize >= maxY) break;
                newBranchSize = newSize;
            }
            wavesBranchesSizes[i] = Math.abs(newBranchSize);
            wavePosition += newBranchSize;
        }
    }

    var id = -1, pX = startX - 1, pY = startY;// last fitted position
    //field.push({id:0, x:pX, y:pY, type:standard});
    var field = [];
    for (var i = 0, max = straightTilesSizes.length + wavesBranchesSizes.length; i < max; i++) {
        var space = i % 2 == 0;// true == draw space (straight tiles), false == draw wave branch
        if (space) {
            for (var j = 0, len = straightTilesSizes[Math.floor(i / 2)]; j < len; j++) {
                id++;
                pX++;
                field.push({id: id, x: pX, y: pY, type: standard});
            }
        } else {
            var branchIndex = Math.floor(i / 2);
            var way = 1;
            var startBranch = branchIndex % 2 == 0;
            if (startBranch) way *= -1;
            if (Math.floor(branchIndex / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            for (var j = 0, len = wavesBranchesSizes[branchIndex]; j < len; j++) {
                id++;
                pY += way;//pY += way > 0 ? 1 : -1;
                field.push({id: id, x: pX, y: pY, type: standard});
            }

            if (startBranch) {
                for (var j = 0; j < 2; j++) {
                    id++;
                    pX++;
                    field.push({id: id, x: pX, y: pY, type: standard});
                }
            }
        }
    }
    return field;
}

function addJumpsToField(field, jumpCreationChance, maxJumpDistance) {
    var cornersIndexes = [];
    for (var i = 1, len = field.length - 1; i < len; i++) {// detect corners
        var actualPoint = field[i];
        var previousPoint = field[i - 1];
        var nextPoint = field[i + 1];

        if (!((actualPoint.x == previousPoint.x && actualPoint.x == nextPoint.x)
            || (actualPoint.y == previousPoint.y && actualPoint.y == nextPoint.y))) {
            cornersIndexes.push(i);
        }
    }

    for (var i = 0, len = cornersIndexes.length; i < len; i++) {
        var chance = Math.random();
        if (chance < jumpCreationChance) {
            continue;// skip some corners
        }

        var jumpLen = Math.floor(Math.random() * (maxJumpDistance - 1) + 2);

        var leftChange = Math.floor(jumpLen / 2);
        var rightChange = jumpLen - leftChange;

        var leftIndex = cornersIndexes[i] - leftChange;
        var rightIndex = cornersIndexes[i] + rightChange;

        if (leftChange < 0 || rightChange >= len) {
            continue;// can't generate jump here
        }

        var leftPoint = field[leftIndex];
        var rightPoint = field[rightIndex];

        if (leftPoint.type != standard || rightPoint.type != standard) {
            continue;// can't generate jump here
        }

        var problem = false;
        for (var j = leftIndex + 1, max = rightIndex; j < max; j++) {
            if (field[j].type == jump) {
                problem = true;
                break;
            }
        }
        if (problem) {
            continue;// jump in jump is not allowed
        }

        leftPoint.type = jump;
        leftPoint.jumpDestinationId = rightPoint.id;
        rightPoint.type = jump;
        rightPoint.jumpDestinationId = leftPoint.id;
    }
}

function addQuestionsToField(field, minDiff, maxDiff) {
    var diff = 0, targetDiff = Math.floor(Math.random() * (maxDiff - minDiff + 1)) + minDiff;
    for (var i = 0, len = field.length; i < len; i++) {
        var point = field[i];
        if (point.type != standard) continue;

        diff++;
        if (diff == targetDiff) {
            diff = 0;
            targetDiff = Math.floor(Math.random() * (maxDiff - minDiff + 1)) + minDiff;

            point.type = question;
        }
    }
}

function getFirstField() {//TODO: remove

    var coordinates = [
        [0, 1, /*start*/standard], [1, 1, standard], [2, 1, standard], [3, 1, standard], [4, 1, standard], [5, 1, question], [6, 1, standard],
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
        [33, 8, standard], [34, 8, standard], [35, 8, /*end*/standard]
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

    // This functions will generate the playing field and return it.
    generateNewField: function () {//TODO: maybe add some arguments to this method
        var field = generateField(75, 40, 250);//TODO: better arguments
        addJumpsToField(field, 0.4, 4);//TODO: better arguments
        addQuestionsToField(field, 2, 7);//TODO: better arguments
        console.log(drawFieldToString(field));
        return field;
    }
};