const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

let data = input.trim().split('\n');

function mergeIntervals(intervals) {
  if (intervals.length < 2) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  const result = [];
  let previous = intervals[0];

  for (let i = 1; i < intervals.length; i += 1) {
    if (previous[1] >= intervals[i][0]) {
      previous = [previous[0], Math.max(previous[1], intervals[i][1])];
    } else {
      result.push(previous);
      previous = intervals[i];
    }
  }

  result.push(previous);

  return result;
};

function parseBeaconData(input) {
  return input.trim().split('\n').map(dataItem => {
    let result = dataItem.match(/([-\d]+)/g);
    result = result.map(r => parseInt(r));

    return {
      sensor: [result[1], result[0]],
      beacon: [result[3], result[2]]
    }
  })
}

function manhattanDistance(pointA, pointB) {
  return Math.abs(pointA[0] - pointB[0]) + Math.abs(pointA[1] - pointB[1]);
}

function getRowInterval(sensor, beacon, row) {
  const DT = Math.abs(sensor[0] - row);
  const DSB = manhattanDistance(sensor, beacon);

  if (DT > DSB) {
    return null;
  }

  const DELTA = DSB - DT;

  return [sensor[1] - DELTA, sensor[1] + DELTA];
}


function getUnusedPositions(beaconData, row) {
  const intervals = [];

  for (const dataPair of beaconData) {
    const interval = getRowInterval(dataPair.sensor, dataPair.beacon, row);

    if (!interval) {
      continue;
    }

    intervals.push(interval);
  }

  return mergeIntervals(intervals);
}

function calculateUnusedSpaces(intervals) {
  return intervals.reduce((sum, interval) => sum + (interval[1] - interval[0]), 0);
}

var start = process.hrtime()

const TARGET = 2000000;

const beaconData = parseBeaconData(input);
const unusedIntervals = getUnusedPositions(beaconData, TARGET);

const unusedPoints = calculateUnusedSpaces(unusedIntervals);

console.log(unusedPoints);

var end = process.hrtime(start)
console.info('Calculation time: %ds %dms', end[0], end[1] / 1000000)