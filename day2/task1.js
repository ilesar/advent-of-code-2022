const fs = require('fs');

// A - rock, B - paper, C - scissors
// X - rock, Y - paper, Z - scissors

const outcomes = {
    AX: 3,
    AY: 6,
    AZ: 0,
    BX: 0,
    BY: 3,
    BZ: 6,
    CX: 6,
    CY: 0,
    CZ: 3,
}

const shapePoints = {
    X: 1,
    Y: 2,
    Z: 3,
}

const input = fs.readFileSync('input.txt', 'utf8').trim();

const data = input.split('\n').map(chunk =>
    chunk.replace(' ', '')
)
console.dir(data, { maxArrayLength: null })
const score = data.reduce((agg, round) => {
    return agg + outcomes[round] + shapePoints[round[1]];
}, 0)

console.log(score);
