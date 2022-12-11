const fs = require('fs');

const input = fs.readFileSync('testinput.txt', 'utf8');

const data = input.trim().split('\n').map(row => row.split('').map(item => parseInt(item)));

const visibleData = data.map(row => row.map(item => 0));


function checkVector(vector, visibleVector) {
    let max;
    for (let v = 0; v < vector.length; v++) {
        if (max == null || vector[v] > max) {
            visibleVector[v] = 1;
            max = vector[v];
        }
    }

    max = null;
    for (let v = vector.length - 1; v >= 0; v--) {
        if (max == null || vector[v] > max) {
            visibleVector[v] = 1;
            max = vector[v];
        }
    }
}

for (let i = 0; i < data.length; i++) {
    checkVector(data[i], visibleData[i]);
}

const transposedData = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
const transposedVisibleData = visibleData[0].map((_, colIndex) => visibleData.map(row => row[colIndex]));

for (let i = 0; i < data.length; i++) {
    checkVector(transposedData[i], transposedVisibleData[i]);
}

const retransposedVisibleData = transposedVisibleData[0].map((_, colIndex) => transposedVisibleData.map(row => row[colIndex]));

for (let i = 0; i < visibleData.length; i++) {
    for (let j = 0; j < visibleData[i].length; j++) {
        visibleData[i][j] += retransposedVisibleData[i][j];
    }
}

console.log(visibleData.reduce((agg, row) => {
    return agg + row.reduce((rowagg, item) => {
        return rowagg + (!!item ? 1 : 0);
    }, 0)
}, 0));