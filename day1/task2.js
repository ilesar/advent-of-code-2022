const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.split('\n\n').map(chunk =>
    chunk.trim().split('\n').map(item => parseInt(item))
)

const sumArray = data.map(chunk => chunk.reduce((a, i) => a + i, 0));

const max = sumArray.sort().reverse().slice(0, 3).reduce((i, a) => i + a);

console.log(max);


