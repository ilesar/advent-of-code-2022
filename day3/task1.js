const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n');

function getPriority(character) {
    if (character.charCodeAt(0) >= 'a'.charCodeAt(0)) {
        return character.charCodeAt(0) - 97 + 1;
    }

    return character.charCodeAt(0) - 65 + 27;
}

const duplicates = data.map(rucksack => {
    const part1 = rucksack.slice(0, rucksack.length / 2);
    const part2 = rucksack.slice(rucksack.length / 2, rucksack.length);

    let duplicate = null;

    for (let i = 0; i < part1.length; i++) {
        if (part2.includes(part1.charAt(i))) {
            duplicate = part1.charAt(i);
        }
    }

    return duplicate;
})

const result = duplicates.filter(d => d).reduce((a, d) => {
    return a + getPriority(d);
}, 0);

console.log(result);