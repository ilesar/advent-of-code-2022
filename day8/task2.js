const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n').map(row => row.split('').map(item => parseInt(item)));

const scenicData = data.map(row => row.map(item => -1));


for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
        scenicData[i][j] = calculateScenicData(i, j);
    }
}

function scenicArray(i, j) {
    return [calculateUp(i, j), calculateRight(i, j), calculateDown(i, j), calculateLeft(i, j)];
}


function calculateScenicData(i, j) {
    return calculateUp(i, j) *
        calculateDown(i, j) *
        calculateLeft(i, j) *
        calculateRight(i, j);
}

function calculateUp(i, j) {
    let sum = 0;
    const max = data[i][j];

    while (i >= 0) {
        i--;

        if (data[i] == null || data[i][j] == null) {
            break;
        }

        sum++;

        if (data[i][j] >= max) {
            break;
        }
    }

    return sum;
}

function calculateRight(i, j) {
    let sum = 0;
    const max = data[i][j];

    while (j < data[0].length) {
        j++;

        if (data[i] == null || data[i][j] == null) {
            break;
        }

        sum++;

        if (data[i][j] >= max) {
            break;
        }
    }

    return sum;
}

function calculateDown(i, j) {
    let sum = 0;
    const max = data[i][j];

    while (i < data.length) {
        i++;

        if (data[i] == null || data[i][j] == null) {
            break;
        }

        sum++;

        if (data[i][j] >= max) {
            break;
        }
    }

    return sum;
}

function calculateLeft(i, j) {
    let sum = 0;
    const max = data[i][j];

    while (j >= 0) {
        j--;

        if (data[i] == null || data[i][j] == null) {
            break;
        }

        sum++;

        if (data[i][j] >= max) {
            break;
        }
    }

    return sum;
}


let result = 0;

for (let i = 0; i < scenicData.length; i++) {
    for (let j = 0; j < scenicData[i].length; j++) {
        if (scenicData[i][j] > result) {
            result = scenicData[i][j];
        }
    }
}


console.log(result);