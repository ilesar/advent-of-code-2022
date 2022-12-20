const fs = require("fs");

const input = fs.readFileSync(`${__dirname}/input.txt`, "utf8");

const directions = input.trim().split("");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class Rock {
  points = [];

  move(direction) {
    switch (direction) {
      case ">":
        this.points = this.points.map((point) => [point[0], point[1] + 1]);
        break;
      case "<":
        this.points = this.points.map((point) => [point[0], point[1] - 1]);
        break;
      case "up":
        this.points = this.points.map((point) => [point[0] + 1, point[1]]);
        break;
      case "down":
        this.points = this.points.map((point) => [point[0] - 1, point[1]]);
        break;
    }
  }
}

class HorizontalRock extends Rock {
  points = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ];
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
  ];
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
  ];
  height = 3;
  width = 3;
}

class VerticalRock extends Rock {
  points = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ];
  height = 4;
  width = 1;
}

class SquareRock extends Rock {
  points = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
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
      tunnelCopy[point[0]][point[1]] = "@";
    }
  }

  //   console.log(placedRocks);
  placedRocks.forEach((placedPoint) => {
    const coordinates = placedPoint.split("-");
    tunnelCopy[coordinates[0]][coordinates[1]] = "#"; // 👉️ one, two, three, four
  });

  for (let i = tunnelCopy.length - 1; i >= 0; i--) {
    let row = "";
    for (let j = 0; j < tunnelCopy[i].length; j++) {
      row += tunnelCopy[i][j];
    }

    console.log(`|${row}|`);
  }
  console.log("+-------+");
}

function detectCollision(rock) {
  for (const point of rock.points) {
    if (placedRocks.has(`${point[0]}-${point[1]}`)) {
      return "rock";
    }

    if (point[0] < 0) {
      return "floor";
    }

    if (point[1] < 0 || point[1] >= 7) {
      return "wall";
    }
  }
}

function placeInTunnel(rock, baseline) {
  rock.points = rock.points.map((point) => {
    return [point[0] + baseline + 4, point[1] + 2];
  });
}

function getNewBaseline(newlyPlacedRock, baseline) {
  for (const point of newlyPlacedRock.points) {
    BASELINE = Math.max(BASELINE, point[0]);
  }
  return BASELINE;
}

async function print(rock) {
  console.clear();
  printTunnel(rock);
  //   await sleep(100);
  //   await keypress();
}

function placeRock(rock) {
  for (const point of rock.points) {
    placedRocks.add(`${point[0]}-${point[1]}`);
  }
}

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};

const ROCKS = 2022;
// const ROCKS = 10;
let rocks = [];
let placedRocks = new Set();

while (rocks.length < ROCKS) {
  rocks = [
    ...rocks,
    ...[
      new HorizontalRock(),
      new PlusRock(),
      new LRock(),
      new VerticalRock(),
      new SquareRock(),
    ],
  ];
}

rocks.splice(ROCKS, rocks.length - ROCKS);

let BASELINE = -1;
const TUNNEL_WIDTH = 7;
const TUNNEL = Array(200000)
  .fill()
  .map(() => Array(TUNNEL_WIDTH).fill("."));

(async () => {
  while (rocks.length > 0) {
    const rock = rocks[0];

    placeInTunnel(rock, BASELINE);

    // await print(rock);
    // process.exit(0);

    while (true) {
      const horizontalDirection = getDirection();
      rock.move(horizontalDirection);

      let collision = detectCollision(rock);
      if (collision == "rock" || collision == "wall") {
        rock.move(horizontalDirection == "<" ? ">" : "<");
        // placeRock(rock);
      }

      //   await print(rock);

      rock.move("down");
      collision = detectCollision(rock);
      if (collision == "rock" || collision == "floor") {
        rock.move("up");
        placeRock(rock);
        getNewBaseline(rock);
        break;
      }

      //   await print(rock);
    }

    // placedRocks.push(rock);
    rocks.splice(0, 1);
  }

  console.log("RESULT", BASELINE + 1);
})();
