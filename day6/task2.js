const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim();

const chars = 14;

for (let i = 3; i < data.length; i++) {
    const set = new Set();

    for (let j = 0; j < chars; j++) {
        set.add(data[i - j]);
    }

    if (set.size === chars) {
        console.log('Result:', data[i - 3], data[i - 2], data[i - 1], data[i]);
        console.log('Result:', i + 1);
        break;
    }
}