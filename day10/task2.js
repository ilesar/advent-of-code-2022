const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n');

let cycle = 1;
let register = 1;

class Sprite {
    pixels = [
        [0, 0],
        [0, 1],
        [0, 2],
    ]

    contains(pixel) {
        for (let i = 0; i < this.pixels.length; i++) {
            if (pixel[1] == this.pixels[i][1]) {
                return true;
            }
        }

        return false;
    }

    setPixels(pixels) {
        if (pixels.length !== 3) {
            throw Error("Not enough sprite pixels");
        }

        this.pixels = pixels;
    }
}

class Screen {
    WIDTH = 40;
    HEIGHT = 6;
    matrix = Array(this.HEIGHT).fill().map(() => Array(this.WIDTH).fill('.'));
    sprite = new Sprite();

    setRegister(register) {
        const newPixels = [];

        for (let i = 0; i < 3; i++) {
            const row = Math.floor((register + i - 1) / this.WIDTH);
            const column = (register + i - 1) % this.WIDTH;
            newPixels.push([row, column]);
        }


        this.sprite.setPixels(newPixels);
    }

    drawDebug() {
        for (let i = 0; i < this.matrix.length; i++) {
            let row = '';
            for (let j = 0; j < this.matrix[i].length; j++) {
                let character = this.matrix[i][j];

                if (this.sprite.contains([i, j])) {
                    character = '?';
                }
                row += character;
            }

        }
    }

    draw() {
        for (let i = 0; i < this.matrix.length; i++) {
            let row = '';
            for (let j = 0; j < this.matrix[i].length; j++) {
                let character = this.matrix[i][j];
                row += character;
            }
        }
    }
}

const screen = new Screen();

function increaseCycle() {
    const row = Math.floor((cycle - 1) / screen.WIDTH);
    const column = (cycle - 1) % screen.WIDTH;

    if (screen.sprite.contains([row, column])) {
        screen.matrix[row][column] = '#';
    }

    cycle++;
}


let it = 0;
for (const command of data) {
    const commandParts = command.split(' ');

    switch (commandParts[0]) {
        case 'addx':
            increaseCycle();
            increaseCycle();
            register += parseInt(commandParts[1]);
            screen.setRegister(register);
            break;
        case 'noop':
            increaseCycle();
            break;
    }

    it++;
}

screen.draw();