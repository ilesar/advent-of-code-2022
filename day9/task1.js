const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n').map(row => ({
    direction: row.split(' ')[0],
    movement: parseInt(row.split(' ')[1]),
}));

function moveKnot(knot, direction) {
    switch (direction) {
        case 'U':
            knot.y += 1;
            break;
        case 'R':
            knot.x += 1;
            break;
        case 'D':
            knot.y -= 1;
            break;
        case 'L':
            knot.x -= 1;
            break;
    }
}

function knotsTouching(knotA, knotB) {
    return Math.sqrt(Math.pow(knotA.x - knotB.x, 2) + Math.pow(knotA.y - knotB.y, 2)) < 2;
}

function calculateMovementVector(knotA, knotB) {
    return {
        x: knotA.x - knotB.x,
        y: knotA.y - knotB.y,
    };
}

function movementVectorToDirections(vector) {
    const direction = {
        x: '',
        y: '',
    }

    if (vector.x >= 1) {
        direction.x = 'R';
    }

    if (vector.y >= 1) {
        direction.y = 'U';
    }

    if (vector.x <= -1) {
        direction.x = 'L';
    }

    if (vector.y <= -1) {
        direction.y = 'D';
    }

    return direction.x + direction.y;
}

function notePosition(knot) {
    tailPositionMatrix[knot.y][knot.x] = 1;
}

const ROWS = 5000;
const COLUMNS = 6000;
const TAIL_LENGTH = 1;
const tailPositionMatrix = Array(ROWS).fill().map(() => Array(COLUMNS).fill(0))

const headPosition = {
    x: Math.round(ROWS / 2),
    y: Math.round(COLUMNS / 2)
}

const tailPositions = Array(TAIL_LENGTH).fill().map(() => ({
    x: Math.round(ROWS / 2),
    y: Math.round(COLUMNS / 2)
}));

for (const move of data) {

    for (let i = 0; i < move.movement; i++) {
        moveKnot(headPosition, move.direction);

        for (let t = 0; t < tailPositions.length; t++) {
            const dependent = (t == 0) ? headPosition : tailPositions[t - 1];

            if (!knotsTouching(dependent, tailPositions[t])) {

                const tailDirections = movementVectorToDirections(calculateMovementVector(dependent, tailPositions[t])).split('');

                for (const tailDirection of tailDirections) {
                    moveKnot(tailPositions[t], tailDirection);
                }
            }
        }

        notePosition(tailPositions[tailPositions.length - 1]);
    }
}

console.log(tailPositionMatrix.reduce((agg, row) => agg + row.reduce((rowAgg, item) => rowAgg + item, 0), 0))