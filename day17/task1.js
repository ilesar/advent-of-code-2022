const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/testinput.txt`, 'utf8');

const directions = input.trim().split('');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

class Rock {
    points = [];
    placeInTunnel(lowestPoint) {
        this.points = this.points.map(point => {
            return [point[0] + lowestPoint + 3, point[1] + 2]
        })
    }

    move(direction) {
        console.log('MOVE SIDEWAYS');
        let movement = 1;

        if (direction == '<') {
            movement = -1;
        }

        if (movement == 1 && this.points[this.points.length - 1][1] == TUNNEL_WIDTH - 1) {
            console.log('CANT MOVE RIGHT')
            return;
        }

        if (movement == -1 && this.points[0][1] == 0) {
            console.log('CANT MOVE LEFT')
            return;
        }

        console.log(this.points);
        this.points = this.points.map(point => [point[0], point[1] + movement]);
    }

    fall() {
        console.log('FALL');
        this.points = this.points.map(point => [point[0] - 1, point[1]]);
    }
}

class HorizontalRock extends Rock {
    points = [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
    ]
    height = 1;
    width = 4;
}

class PlusRock extends Rock {
    points = [
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
    ]
    height = 3;
    width = 3;
}

class LRock extends Rock {
    points = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 2],
        [2, 2],
    ]
    height = 3;
    width = 3;
}

class VerticalRock extends Rock {
    points = [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
    ]
    height = 4;
    width = 1;
}

class SquareRock extends Rock {
    points = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
    ]
    height = 1;
    width = 4;
}

let currentDirection = 0;

function getDirection() {
    const dir = directions[currentDirection];

    currentDirection++;
    if (currentDirection >= directions.length) {
        currentDirection = 0;
    }

    return dir;
}

function printTunnel(currentRock = null) {
    const tunnelCopy = JSON.parse(JSON.stringify(TUNNEL));

    if (currentRock) {
        for (const point of currentRock.points) {
            tunnelCopy[point[0]][point[1]] = '@';
        }
    }

    for (const placedRock of placedRocks) {
        for (const point of placedRock.points) {
            tunnelCopy[point[0]][point[1]] = '#';
        }
    }

    for (let i = tunnelCopy.length - 1; i >= 0; i--) {
        let row = '';
        for (let j = 0; j < tunnelCopy[i].length; j++) {
            row += tunnelCopy[i][j];
        }

        console.log(`|${row}|`);
    }
    console.log('+-------+');

}

// const ROCKS = 2022;
const ROCKS = 5;
let rocks = [];
let placedRocks = [];
while (rocks.length < ROCKS) {
    rocks = [...rocks, ...[
        new HorizontalRock(),
        new PlusRock(),
        new LRock(),
        new VerticalRock(),
        new SquareRock,
    ]]
}

rocks.splice(ROCKS, rocks.length - ROCKS);

const LOWEST_POINT = 0;
const TUNNEL_WIDTH = 7;
const TUNNEL = Array(10).fill().map(() => Array(TUNNEL_WIDTH).fill('.'))


console.log(getDirection());

(async () => {
    while (rocks.length > 0) {
        const rock = rocks[0];
        collision = false;

        while (!collision) {
            rock.placeInTunnel(LOWEST_POINT);
            // console.clear();
            printTunnel(rock);
            await sleep(1000);
            rock.move(getDirection);
            // console.clear();
            printTunnel(rock);
            await sleep(1000);
            rock.fall();
            // console.clear();
            printTunnel(rock);
            await sleep(1000);
        }

        rock.placeInTunnel(LOWEST_POINT);
        // placedRocks.push(rock);
        rocks = [];
        rocks.splice(0, 1);

    }
})();



