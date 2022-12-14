const fs = require('fs');
const { env } = require('process');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

const data = input.trim().split('\n');


let DIMENSIONS = [0, 0];

const paths = data.map(dataItem =>
    dataItem.split(' -> ').map(chunk =>
        chunk.split(',').map((item, index) => {
            const number = parseInt(item);

            if (item > DIMENSIONS[index]) {
                DIMENSIONS[index] = number;
            }

            return number;
        }).reverse()
    )
)

const environment = Array(DIMENSIONS[1] + 3).fill().map(() => Array(DIMENSIONS[0] * 2).fill('.'))

function printEnv() {
    for (let i = 0; i < environment.length; i++) {
        let row = '';
        for (let j = 0; j < environment[i].length; j++) {
            row += environment[i][j];
        }

        console.log(row);
    }
}

function addPath(start, finish) {
    let i = start[1];
    let j = start[0];

    for (let i = start[0]; (finish[0] - start[0]) > 0 ? i <= finish[0] : i >= finish[0]; i += (finish[0] - start[0]) > 0 ? 1 : -1) {
        for (let j = start[1]; (finish[1] - start[1]) > 0 ? j <= finish[1] : j >= finish[1]; j += (finish[1] - start[1]) > 0 ? 1 : -1) {
            environment[i][j] = '█';
        }
    }
}

for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
        addPath(path[i], path[i + 1]);
    }
}

addPath([environment.length - 1, 0], [environment.length - 1, environment[0].length - 1])



let it = 0;
let grains = 0;

function sandFall() {


    while (true) {
        let sandParticle = [0, 500];

        while (true) {
            if (sandParticle[0] == DIMENSIONS[1] + 2) {
                return;
            }

            if (environment[sandParticle[0] + 1][sandParticle[1]] == '.') {
                sandParticle = [sandParticle[0] + 1, sandParticle[1]];
                continue;
            }

            if (environment[sandParticle[0] + 1][sandParticle[1] - 1] == '.') {
                sandParticle = [sandParticle[0] + 1, sandParticle[1] - 1];
                continue;
            }

            if (environment[sandParticle[0] + 1][sandParticle[1] + 1] == '.') {
                sandParticle = [sandParticle[0] + 1, sandParticle[1] + 1];
                continue;
            }

            if (environment[sandParticle[0]][sandParticle[1]] == 'o') {
                return;
            }

            it++;

            environment[sandParticle[0]][sandParticle[1]] = 'o';
            break;
        }

    }
}

sandFall();

console.log(it);