const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

const data = input.trim().split('\n\n');

const packetData = data.map(dataItem => dataItem.split('\n').map(packetPart => eval(packetPart)));

function resolvePacket(packetLeft, packetRight) {
    if (typeof packetLeft === 'number' && typeof packetRight === 'number') {
        if (packetLeft < packetRight) {
            return 'valid';
        }

        if (packetLeft > packetRight) {
            return 'invalid';
        }

        if (packetLeft == packetRight) {
            return 'continue';
        }

        throw new Error('what');
    }

    if (Array.isArray(packetLeft) && Array.isArray(packetRight)) {
        for (let i = 0; i < packetLeft.length; i++) {
            if (packetRight[i] === undefined) {
                return 'invalid';
            }

            const result = resolvePacket(packetLeft[i], packetRight[i]);

            if (result == 'valid') {
                return 'valid';
            }

            if (result == 'continue') {
                continue;
            }

            if (result == 'invalid') {
                return 'invalid';
            }
        }

        if (packetLeft.length == packetRight.length) {
            return 'continue';
        }

        return 'valid';
    }

    if (typeof packetLeft === 'number') {
        return resolvePacket([packetLeft], packetRight);
    }

    if (typeof packetRight === 'number') {
        return resolvePacket(packetLeft, [packetRight]);
    }
}



let index = 1;
let indexes = [];

for (const packet of packetData) {
    const validPacket = resolvePacket(packet[0], packet[1]);

    if (validPacket == 'valid') {
        indexes.push(index);
    }

    index++;
}

console.log(indexes);
console.log(indexes.reduce((a, i) => a + i, 0));