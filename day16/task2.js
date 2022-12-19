const fs = require('fs');
const internal = require('stream');

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

function getValveData(input) {
  return input.trim().split('\n').map(item => {
    const match = item.match(/Valve (\w+) has flow rate=(\d+); tunnel[s]* lead[s]* to valve[s]*\s(.*)/);

    return {
      name: match[1],
      rate: parseInt(match[2]),
      connectedValves: match[3].split(', '),
    }
  })
}

function createValveGraph(valveData) {
  const graph = {};
  for (const valve of valveData) {
    graph[valve.name] = {};

    for (const connectedValve of valve.connectedValves) {
      graph[valve.name][connectedValve] = 1;
    }
  }

  return graph;
}

const distanceMap = new Map();


function calculateValveValues(valveData, valveGraph, currentValves, remainingMinutes, elephantRemainingMinutes, visitedValves, sum, iteration) {
  if (remainingMinutes <= 0 || elephantRemainingMinutes <= 0) {
    if (sum > maxPressure) {
      maxPressure = sum;
      console.clear();
      console.log(maxPressure);
    }
    return;
  }

  // console.log('CURRENT', currentValves);
  // console.log('ME', remainingMinutes);
  // console.log('ELEPHANT', elephantRemainingMinutes);

  // if (iteration >= 2) {
  //   process.exit(0);
  // }

  let potentialValves = valveData.filter(valve => !visitedValves.includes(valve.name) && !currentValves.includes(valve.name)).map(valve => {
    const savedDistance = distanceMap.get(`${currentValve}-${valve.name}`);
    let shortestDistance;
    if (!savedDistance) {
      shortestDistance = findShortestPath(valveGraph, currentValve, valve.name).distance;
      shortestDistance = shortestDistance == "Infinity" ? 0 : shortestDistance;

      distanceMap.set(`${currentValve}-${valve.name}`, shortestDistance);
    } else {
      shortestDistance = savedDistance;
    }


    return {
      name: valve.name,
      distance: shortestDistance,
      rate: valve.rate,
      gain: ((remainingMinutes - shortestDistance - 1) * valve.rate)
    }
  }).sort((a, b) => a.distance - b.distance).filter(potentialValue => potentialValue.gain > 0)

  let elephantPotentialValves = valveData.filter(valve => !visitedValves.includes(valve.name) && !currentValves.includes(valve.name)).map(valve => {
    const savedDistance = distanceMap.get(`${currentValve}-${valve.name}`);
    let shortestDistance;
    if (!savedDistance) {
      shortestDistance = findShortestPath(valveGraph, currentValve, valve.name).distance;
      shortestDistance = shortestDistance == "Infinity" ? 0 : shortestDistance;

      distanceMap.set(`${currentValve}-${valve.name}`, shortestDistance);
    } else {
      shortestDistance = savedDistance;
    }

    return {
      name: valve.name,
      distance: shortestDistance,
      rate: valve.rate,
      gain: ((elephantRemainingMinutes - shortestDistance - 1) * valve.rate)
    }
  }).sort((a, b) => a.distance - b.distance).filter(potentialValue => potentialValue.gain > 0)

  // console.log(potentialValves);
  // process.exit(0);

  if (potentialValves.length == 0 && elephantPotentialValves == 0) {
    // console.log("NO POTENTIAL VALUES LEFT", sum);
    if (sum > maxPressure) {
      maxPressure = sum;
      console.clear();
      console.log(maxPressure);
    }
  }

  // console.log(potentialValves.length);
  // console.log('POT', potentialValves);
  // console.log(sum);
  // console.log(Math.max(...pressures));
  // if (Math.max(...pressures) > 1707) {

  //   process.exit(0)
  // }


  for (const potentialValve of potentialValves) {
    const otherValves = elephantPotentialValves.filter(potVal => potVal.name != potentialValve.name);
    // console.log(otherValves);

    for (const otherValve of otherValves) {

      // console.log('M', potentialValve.name, remainingMinutes);
      // console.log('E', otherValve.name, elephantRemainingMinutes);

      // console.log(potentialValve);
      // console.log(otherValve);
      // console.log('---')

      calculateValveValues(valveData, valveGraph, [potentialValve.name, otherValve.name], remainingMinutes - potentialValve.distance - 1, elephantRemainingMinutes - otherValve.distance - 1, [...visitedValves, ...currentValves], sum + potentialValve.gain + otherValve.gain, iteration + 1);
    }
  }

}

let MINUTES = 26;

const valveData = getValveData(input);
const valveGraph = createValveGraph(valveData);

currentValve = 'AA';
const pressures = [];
let maxPressure = 0;

const cleanedValveData = valveData.filter(valve => valve.rate != 0);
calculateValveValues(cleanedValveData, valveGraph, [currentValve, currentValve], MINUTES, MINUTES, [], 0, 0);

console.log('final', maxPressure);

