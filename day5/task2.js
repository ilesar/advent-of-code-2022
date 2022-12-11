const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n\n');

let matrix = data[0].replaceAll('[', ' ').replaceAll(']', ' ');

matrix = matrix.split('\n');

matrix = matrix.map(row => row.slice(1, -1))

let newMatrix = [];

for (let i = 0; i < matrix[0].length; i++) {
    newMatrix.push('');
}

for (let i = matrix.length - 1; i >= 0; i--) {
    for (let j = 0; j < matrix[i].length; j++) {
        newMatrix[j] += (matrix[i][j]);
    }
}

newMatrix = newMatrix.map(row => row.trim()).filter(row => row.length)

function printMap(map) {
    const printmap = new Map();
    for (let [key, value] of map) {
        printmap.set(key, value.join(''))
    }

    console.log(printmap);
}


const map = new Map();

for (const row of newMatrix) {
    const elements = row.split('');

    const index = parseInt(elements.slice(0, 1));
    elements.shift();

    map.set(index, elements);
}

printMap(map);

const orders = data[1].trim().split('\n');
let x = 0;
for (const order of orders) {
    const found = order.match(/(\d+) from (\d+) to (\d+)/);
    const quantity = found[1];
    const source = found[2];
    const destination = found[3];

    let sourceRow = map.get(parseInt(source));
    let destinationRow = map.get(parseInt(destination));

    elements = sourceRow.splice(sourceRow.length - quantity, quantity);
    destinationRow = [...destinationRow, ...elements];

    map.set(parseInt(source), sourceRow);
    map.set(parseInt(destination), destinationRow);
}


let result = '';
for (let [key, value] of map) {
    result += value[value.length - 1] ? value[value.length - 1] : '';
}

console.log(result);