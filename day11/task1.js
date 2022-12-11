const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n\n');

class Item {
    worryLevel = null;

    constructor(worryLevel) {
        this.worryLevel = worryLevel;
    }

    setWorryLevel(newWorryLevel) {
        this.worryLevel = newWorryLevel;
    }
}

class Monkey {
    items = [];
    operation = null;
    test = null;
    decision = {
        true: null,
        false: null,
    }
    inspections = 0;

    constructor(items, operation, test, decisionTrue, decisionFalse) {
        this.items = items;
        this.operation = operation;
        this.test = test;
        this.decision.true = decisionTrue;
        this.decision.false = decisionFalse;
    }
}

function resolveOperation(operator, operand) {
    switch (operand) {
        case 'old':
            return (x) => Math.pow(x, 2);
        default:
            switch (operator) {
                case '+':
                    return (x) => x + parseInt(operand);
                case '*':
                    return (x) => x * parseInt(operand);
            }
    }
}

const monkeys = [];

for (const dataItem of data) {
    const lines = dataItem.split('\n').map(line => line.trim());
    const itemWorryLevels = lines[1].match(/(\d+)+/gm);
    const operation = lines[2].match(/([+*\/-]) (\d+|\w+)/);
    const test = parseInt(lines[3].match(/(\d+)/gm)[0]);
    const trueMonkeyIndex = parseInt(lines[4].match(/(\d+)/gm)[0]);
    const falseMonkeyIndex = parseInt(lines[5].match(/(\d+)/gm)[0]);

    const items = [];

    for (const itemWorryLevel of itemWorryLevels) {
        const item = new Item(parseInt(itemWorryLevel));
        items.push(item);
    }

    const monkey = new Monkey(items, resolveOperation(operation[1], operation[2]), test, trueMonkeyIndex, falseMonkeyIndex);
    monkeys.push(monkey);
}

for (let r = 0; r < 20; r++) {
    for (let m = 0; m < monkeys.length; m++) {
        const currentMonkey = monkeys[m];
        while (currentMonkey.items.length > 0) {
            currentMonkey.inspections++;
            const currentItem = currentMonkey.items.shift();

            currentItem.setWorryLevel(currentMonkey.operation(currentItem.worryLevel));
            currentItem.setWorryLevel(Math.floor(currentItem.worryLevel / 3));

            let newMonkeyIndex;

            if (currentItem.worryLevel / currentMonkey.test % 1 == 0) {
                newMonkeyIndex = currentMonkey.decision.true;
            } else {
                newMonkeyIndex = currentMonkey.decision.false;
            }

            monkeys[newMonkeyIndex].items.push(currentItem);
        }
    }
}


monkeys.sort((a, b) => b.inspections - a.inspections);
console.log(monkeys[0].inspections * monkeys[1].inspections);