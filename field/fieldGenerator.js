/**
 * Created by Manuel on 28.11.2016.
 */

// var start = "start"; // FIXME: on table wasn't start type (it isn't required)
// var end = "end"; // FIXME: on table wasn't end type (it isn't required)
const standard = "default";
const question = "question";
const jump = "jump";

const randomNumber = require('../functions/randomNumber');

function drawFieldToString(field) {//TODO: create utils.js and move methods like this there
    if (field.length == 0) return "fieldLen=0, minX=NaN, maxX=NaN, minY=NaN, maxY=NaN";
    let minX = field[0].x, maxX = field[0].x, minY = field[0].y, maxY = field[0].y;
    field.forEach(function (val) {
        minX = Math.min(minX, val.x);
        minY = Math.min(minY, val.y);
        maxX = Math.max(maxX, val.x);
        maxY = Math.max(maxY, val.y);
    });

    const fieldMap = [];
    for (let x = minX; x < maxX + 1; x++) {
        const line = [];
        for (let y = minY; y < maxY + 1; y++) {
            line.push('  ');
        }
        fieldMap.push(line);
    }
    field.forEach(function (val) {
        let typeMark;
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

    let result = "fieldLen=" + field.length + ", minX=" + minX + ", maxX=" + maxX + ", minY=" + minY + ", maxY=" + maxY;
    for (let mapY = 0; mapY < fieldMap[0].length; mapY++) {
        result += "\n";
        for (let mapX = 0; mapX < fieldMap.length; mapX++) {
            result += fieldMap[mapX][mapY];
        }
    }
    return result;
}

function generateField(maxX, maxY, approximateLength) {//TODO: split to more methods
    let startX = 0, startY = randomNumber.getRandomInteger(0, maxY);
    let requiredSizeAddition = approximateLength - maxX;
    if (requiredSizeAddition <= 0) {
        // generate line map (too short length required)
        const field = [];
        for (let i = startX; i < approximateLength + startX; i++) {
            field.push({id: i - startX, x: i, y: startY, type: standard});
        }
        return field;
    }

    let exactPathLength = true;// true == resulting path will have exact length, false == resulting path will be the longest as is possible
    let startWave = randomNumber.getRandomBoolean(), nextWave = startWave;// false == up wave, true == down wave
    let maxOneUpWaveAddition = startY;
    let maxOneDownWaveAddition = maxY - startY;
    let maxWaves = (maxX - 3) / 2;
    let minWaves = 0;

    let tempLength = maxX;
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
        let addOneMoreWave = randomNumber.getRandomBoolean();// this variable is created here only for better code readability
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

    let wavesNum = minWaves;
    let availableStraightTiles = maxX - (wavesNum * 2);
    let straightTilesSizes = new Array((wavesNum * 2) + 1);
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
        let targetSpace = randomNumber.getRandomInteger(0, straightTilesSizes.length);
        availableStraightTiles--;
        straightTilesSizes[targetSpace]++;
    }

    let requiredWavesSize = requiredSizeAddition;
    let wavesBranchesSizes = new Array(wavesNum * 2);
    wavesBranchesSizes.fill(0);

    if (exactPathLength) {
        while (requiredWavesSize > 0) {
            let targetWavesBranch = randomNumber.getRandomInteger(0, wavesBranchesSizes.length);
            let wavePosition = startY;
            let addNextBranchToPosition = wavesBranchesSizes.length - 1 > targetWavesBranch && targetWavesBranch % 2 != 0;
            for (let i = 0, end = targetWavesBranch + (addNextBranchToPosition ? 1 : 0); i <= end; i++) {
                let way = 1;
                if (i % 2 == 0) way *= -1;
                if (Math.floor(i / 2) % 2 != 0) way *= -1;
                if (startWave) way *= -1;

                wavePosition += wavesBranchesSizes[i] * way;
            }

            let way = 1;
            if (targetWavesBranch % 2 == 0) way *= -1;
            if (Math.floor(targetWavesBranch / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            let newWaveBranchSize = wavesBranchesSizes[targetWavesBranch] + 1;

            if (wavePosition + (newWaveBranchSize * way) < 0
                || wavePosition + (newWaveBranchSize * way) >= maxY) continue;

            wavesBranchesSizes[targetWavesBranch] = newWaveBranchSize;
            requiredWavesSize--;
        }
    } else {
        let wavePosition = startY;
        for (let i = 0; i < wavesBranchesSizes.length; i++) {
            let way = 1;
            if (i % 2 == 0) way *= -1;
            if (Math.floor(i / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            let newBranchSize = wavesBranchesSizes[i] * way;
            while (true) {
                let newSize = newBranchSize + way;
                if (wavePosition + newSize < 0 || wavePosition + newSize >= maxY) break;
                newBranchSize = newSize;
            }
            wavesBranchesSizes[i] = Math.abs(newBranchSize);
            wavePosition += newBranchSize;
        }
    }

    let id = -1, pX = startX - 1, pY = startY;// last fitted position
    //field.push({id:0, x:pX, y:pY, type:standard});
    let field = [];
    for (let i = 0, max = straightTilesSizes.length + wavesBranchesSizes.length; i < max; i++) {
        let space = i % 2 == 0;// true == draw space (straight tiles), false == draw wave branch
        if (space) {
            for (let j = 0, len = straightTilesSizes[Math.floor(i / 2)]; j < len; j++) {
                id++;
                pX++;
                field.push({id: id, x: pX, y: pY, type: standard});
            }
        } else {
            let branchIndex = Math.floor(i / 2);
            let way = 1;
            let startBranch = branchIndex % 2 == 0;
            if (startBranch) way *= -1;
            if (Math.floor(branchIndex / 2) % 2 != 0) way *= -1;
            if (startWave) way *= -1;

            for (let j = 0, len = wavesBranchesSizes[branchIndex]; j < len; j++) {
                id++;
                pY += way;//pY += way > 0 ? 1 : -1;
                field.push({id: id, x: pX, y: pY, type: standard});
            }

            if (startBranch) {
                for (let j = 0; j < 2; j++) {
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
    let cornersIndexes = getCornerFieldsIndexes(field);

    for (let i = 0, len = cornersIndexes.length; i < len; i++) {
        let chance = Math.random();
        if (chance < jumpCreationChance) {
            continue;// skip some corners
        }

        let jumpLen = randomNumber.getRandomInteger(2, maxJumpDistance + 1);

        let leftChange = Math.floor(jumpLen / 2);
        let rightChange = jumpLen - leftChange;

        let leftIndex = cornersIndexes[i] - leftChange;
        let rightIndex = cornersIndexes[i] + rightChange;

        if (leftIndex <= 0 || rightIndex >= field.length - 1) {// check for array bounds
            continue;// can't generate jump here
        }

        let leftPoint = field[leftIndex];
        let rightPoint = field[rightIndex];

        if (leftPoint.type != standard || rightPoint.type != standard) {// check for existing jumps
            continue;// can't generate jump here
        }

        let problem = false;
        for (let j = leftIndex + 1, max = rightIndex; j < max; j++) {// check for jumps in range of jump
            if (field[j].type == jump) {
                problem = true;
                break;
            }
        }
        if (problem) continue;// jump in range of jump is not allowed

        let cornersNum = 0;
        for (let j = leftIndex + 1, max = rightIndex; j < max; j++) {// check for jumps over more corners
            if (isCornerField(field, j)) {
                cornersNum++;
            }
        }
        if (cornersNum != 1) {
            continue;// jump over more corners is not allowed
        }


        leftPoint.type = jump;
        leftPoint.jumpDestinationId = rightPoint.id;
        rightPoint.type = jump;
        rightPoint.jumpDestinationId = leftPoint.id;
    }
}

function addQuestionsToField(field, differences) {
    let nextTarget = function () {
        return randomNumber.getRandomInteger(0, differences.length);
    };
    let diff = 0, target = nextTarget();
    for (let i = 0, len = field.length; i < len; i++) {
        diff++;

        let point = field[i];
        if (point.type != standard) continue;

        while (diff > differences[target] && target < differences.length) {
            target++;
        }

        if (target >= differences.length || diff == differences[target]) {
            diff = 0;
            target = nextTarget();

            point.type = question;
        }
    }
}

function getCornerFieldsIndexes(field) {
    let cornersIndexes = [];
    for (let i = 1, len = field.length - 1; i < len; i++) {
        if (isCornerField(field, i)) {
            cornersIndexes.push(i);
        }
    }
    return cornersIndexes;
}

function isCornerField(field, index) {
    if (index <= 0 || index >= field.length - 1) return false;

    let actualPoint = field[index];
    let previousPoint = field[index - 1];
    let nextPoint = field[index + 1];

    return !((actualPoint.x == previousPoint.x && actualPoint.x == nextPoint.x)
    || (actualPoint.y == previousPoint.y && actualPoint.y == nextPoint.y));
}

module.exports = {

    // This functions will generate the playing field and return it.
    generateNewField: function () {//TODO: maybe add some arguments to this method
        let field = generateField(75, 40, 100);//TODO: better arguments
        addJumpsToField(field, 0.4, 4);//TODO: better arguments
        addQuestionsToField(field, [2, 4, 6, 7]);//TODO: better arguments
        return field;
    },

    fieldToString: drawFieldToString
};