/**
 * Created by Manuel on 28.11.2016.
 */

// var start = "start"; // FIXME: on table wasn't start type (it isn't required)
// var end = "end"; // FIXME: on table wasn't end type (it isn't required)
var standard = "default";
var question = "question";
var jump = "jump";

var randomNumber = require('../../functions/randomNumber');

function drawFieldToString(field) {//TODO: create utils.js and move methods like this there
    if (field.length == 0) return "fieldLen=0, minX=NaN, maxX=NaN, minY=NaN, maxY=NaN";
    var minX = field[0].x, maxX = field[0].x, minY = field[0].y, maxY = field[0].y;
    field.forEach(function (val) {
        minX = Math.min(minX, val.x);
        minY = Math.min(minY, val.y);
        maxX = Math.max(maxX, val.x);
        maxY = Math.max(maxY, val.y);
    });

    var fieldMap = [];
    for (var x = minX; x < maxX + 1; x++) {
        var line = [];
        for (var y = minY; y < maxY + 1; y++) {
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
        fieldMap[val.x - minX][val.y - minY] = typeMark;
    });

    var result = "fieldLen=" + field.length + ", minX=" + minX + ", maxX=" + maxX + ", minY=" + minY + ", maxY=" + maxY;
    for (var mapY = 0; mapY < fieldMap[0].length; mapY++) {
        result += "\n";
        for (var mapX = 0; mapX < fieldMap.length; mapX++) {
            result += fieldMap[mapX][mapY];
        }
    }
    return result;
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
    var startWave = randomNumber.getRandomBoolean(), nextWave = startWave;// false == up wave, true == down wave
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
        var addOneMoreWave = randomNumber.getRandomBoolean();// this variable is created here only for better code readability
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

module.exports = {

    // This functions will generate the playing field and return it.
    generateNewField: function () {//TODO: maybe add some arguments to this method
        var field = generateField(75, 40, 250);//TODO: better arguments
        addJumpsToField(field, 0.4, 4);//TODO: better arguments
        addQuestionsToField(field, 2, 7);//TODO: better arguments
        return field;
    },

    fieldToString: drawFieldToString
};