const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n');

function getPriority(character) {
    if (character.charCodeAt(0) >= 'a'.charCodeAt(0)) {
        return character.charCodeAt(0) - 97 + 1;
    }

    return character.charCodeAt(0) - 65 + 27;
}

const groupedData = [];

for (let i = 0; i < data.length; i += 3) {
    groupedData.push(data.slice(i, i + 3));
}

const badges = groupedData.slice(0).map(group => {
    let badge = '';
    for (let i = 0; i < group[0].length; i++) {
        if (group[1].includes(group[0].charAt(i)) && group[2].includes(group[0].charAt(i))) {
            badge = group[0].charAt(i);
        }
    }

    return badge;
})

const result = badges.reduce((a, d) => {
    return a + getPriority(d);
}, 0);

console.log(result);
