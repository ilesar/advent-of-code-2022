const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

const data = input.trim().replaceAll('\n\n', '\n').split('\n');

const packetData = data.map(packetPart => eval(packetPart));

const dividerPackets = [[[2]], [[6]]];

for (const dividerPacket of dividerPackets) {
    packetData.push(dividerPacket);

}

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


packetData.sort((a, b) => resolvePacket(a, b) == 'valid' ? -1 : 1);
result = packetData.reduce((agg, packet, index) => {
    if (dividerPackets.includes(packet)) {
        return agg * (index + 1);
    }

    return agg;
}, 1)

console.log(result);