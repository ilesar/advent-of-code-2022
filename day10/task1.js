const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n');

let cycle = 1;
let register = 1;
let result = 0;

function increaseCycle() {
    cycle++;

    if ((cycle - 20) % 40 == 0) {
        result += cycle * register;
    }
}

for (const command of data) {
    const commandParts = command.split(' ');

    switch (commandParts[0]) {
        case 'addx':
            increaseCycle();
            register += parseInt(commandParts[1]);
            increaseCycle();
            break;
        case 'noop':
            increaseCycle();
            break;
    }
}

console.log(result);