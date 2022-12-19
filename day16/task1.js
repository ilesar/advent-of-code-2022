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

function calculateValveValues(valveData, valveGraph, currentValve, remainingMinutes, visitedValves, sum, iteration, visitedValves) {
  visitedValves = [...visitedValves, currentValve];

  if (remainingMinutes <= 0) {
    if (sum > maxPressure) {
      maxPressure = sum;
      console.clear();
      console.log(maxPressure);
      console.log(visitedValves);
    }
    return;
  }

  let potentialValves = valveData.filter(valve => !visitedValves.includes(valve.name) && valve.name != currentValve).map(valve => {
    let shortestDistance = findShortestPath(valveGraph, currentValve, valve.name).distance;
    shortestDistance = shortestDistance == "Infinity" ? 0 : shortestDistance
    return {
      name: valve.name,
      distance: shortestDistance,
      rate: valve.rate,
      gain: ((remainingMinutes - shortestDistance - 1) * valve.rate)
    }
  }).sort((a, b) => a.distance - b.distance).filter(potentialValue => potentialValue.gain > 0)

  if (potentialValves.length == 0) {
    if (sum > maxPressure) {
      maxPressure = sum;
      console.clear();
      console.log(maxPressure);
      console.log(visitedValves);
    }
    return;
  }


  for (const potentialValve of potentialValves) {
    calculateValveValues(valveData, valveGraph, potentialValve.name, remainingMinutes - potentialValve.distance - 1, [...visitedValves, currentValve], sum + potentialValve.gain, iteration + 1, visitedValves);
  }

}

let MINUTES = 30;

const valveData = getValveData(input);
const valveGraph = createValveGraph(valveData);

currentValve = 'AA';
const pressures = [];
let maxPressure = 0;

const cleanedValveData = valveData.filter(valve => valve.rate != 0);
calculateValveValues(cleanedValveData, valveGraph, currentValve, MINUTES, [], 0, 0, []);

console.log(maxPressure);

