const fs = require('fs');

// A - rock, B - paper, C - scissors
// X - lose, Y - draw, Z - win
// X - rock, Y - paper, Z - scissors

const translations = {
    AX: "Z",
    AY: "X",
    AZ: "Y",
    BX: "X",
    BY: "Y",
    BZ: "Z",
    CX: "Y",
    CY: "Z",
    CZ: "X",
}

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
const translatedData = data.map((round) => round[0] + translations[round]);

const score = translatedData.reduce((agg, round) => {
    return agg + outcomes[round] + shapePoints[round[1]];
}, 0)

console.log(score);
