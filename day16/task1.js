const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');


function shortestDistanceNode(distances, visited) {
  let shortest = null;

  for (let node in distances) {
    let currentIsShortest =
      shortest === null || distances[node] < distances[shortest];
    if (currentIsShortest && !visited.includes(node)) {
      shortest = node;
    }
  }
  return shortest;
};

function findShortestPath(graph, startNode, endNode) {

  let distances = {};
  distances[endNode] = "Infinity";
  distances = Object.assign(distances, graph[startNode]);
  let parents = { endNode: null };
  for (let child in graph[startNode]) {
    parents[child] = startNode;
  }

  let visited = [];
  let node = shortestDistanceNode(distances, visited);

  while (node) {
    let distance = distances[node];
    let children = graph[node];

    for (let child in children) {

      if (String(child) === String(startNode)) {
        continue;
      } else {
        let newdistance = distance + children[child];
        if (!distances[child] || distances[child] > newdistance) {
          distances[child] = newdistance;
          parents[child] = node;
        }
      }
    }
    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  let results = {
    distance: distances[endNode],
    path: shortestPath,
    distances: distances,
  };
  return results;
};

function getShortestPath(pointA, pointB) {
  let savedDistance = distanceMap.get(`${pointA}-${pointB}`);


  if (savedDistance == null) {
    savedDistance = distanceMap.get(`${pointB}-${pointA}`);
  }

  if (savedDistance == null) {
    throw new Error("DAFUQ?!");
  }

  return savedDistance;
}


function getValves(input) {
  return input.trim().split('\n').map(item => {
    const match = item.match(/Valve (\w+) has flow rate=(\d+); tunnel[s]* lead[s]* to valve[s]*\s(.*)/);

    return {
      name: match[1],
      rate: parseInt(match[2]),
      connectedValves: match[3].split(', '),
    }
  })
}

function createValveGraph(valves) {
  const graph = {};
  for (const valve of valves) {
    graph[valve.name] = {};

    for (const connectedValve of valve.connectedValves) {
      graph[valve.name][connectedValve] = 1;
    }
  }

  return graph;
}

function fillDistanceMap(valves) {
  for (let i = 0; i < valves.length; i++) {
    for (let j = 0; j < valves.length; j++) {
      const distance = findShortestPath(valveGraph, valves[i].name, valves[j].name).distance;
      distanceMap.set(`${valves[i].name}-${valves[j].name}`, distance == "Infinity" ? 0 : distance);
    }
  }
}

function calculateValveValues(currentValve, remainingValves, remainingMinutes, sum) {
  if (remainingMinutes <= 0 || remainingValves.length == 0) {
    return;
  }
  if (sum > maxPressure) {
    maxPressure = sum;
  }

  for (let i = 0; i < remainingValves.length; i++) {
    const shortestDistance = getShortestPath(currentValve, remainingValves[i].name);

    remainingValves[i] = {
      name: remainingValves[i].name,
      distance: shortestDistance,
      rate: remainingValves[i].rate,
      gain: ((remainingMinutes - shortestDistance - 1) * remainingValves[i].rate)
    }
  }

  // remainingValves.sort((a, b) => a.distance - b.distance);
  for (const remainingValve of remainingValves) {
    calculateValveValues(
      remainingValve.name,
      remainingValves.filter(valve => valve.name != remainingValve.name),
      remainingMinutes - remainingValve.distance - 1,
      sum + remainingValve.gain,
    );
  }

}



const distanceMap = new Map();
var start = process.hrtime()
let MINUTES = 30;
currentValve = 'AA';
let maxPressure = 0;

const initialValves = getValves(input);
const valveGraph = createValveGraph(initialValves);
const valvesWithPositiveRate = initialValves.filter(valve => valve.rate != 0 || valve.name == "AA");

fillDistanceMap(valvesWithPositiveRate);

calculateValveValues(
  currentValve,
  valvesWithPositiveRate.filter(valve => valve.name != currentValve),
  MINUTES,
  0,
);

console.log('RESULT', maxPressure);

var end = process.hrtime(start)
console.info('Final time: %ds %dms', end[0], end[1] / 1000000)