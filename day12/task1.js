const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const map = input.trim().split('\n').map(row => row.split(''));

const graph = {};


function getNodeName(i, j) {
    return i * map[0].length + j + 1;
}

function getConnectedNodes(i, j) {
    steps = [];

    // down
    if (i < (map.length - 1) && map[i + 1][j]) {
        steps.push([i + 1, j])
    }

    // up
    if (i > 0 && map[i - 1][j]) {
        steps.push([i - 1, j])
    }

    // right
    if (j < (map[i].length - 1) && map[i][j + 1]) {
        steps.push([i, j + 1])
    }

    // left
    if (j > 0 && map[i][j - 1]) {
        steps.push([i, j - 1])
    }

    return steps;
}

function filterNodes(node, steps) {
    const nodeValue = map[node[0]][node[1]].charCodeAt(0);
    return steps.filter((step) => {
        // console.log(map[node[0]][node[1]], map[step[0]][step[1]])
        const stepValue = map[step[0]][step[1]].charCodeAt(0);

        if ((stepValue - nodeValue) <= 1) {
            return true;
        }

        return false;
    })
}

function resolveNode(i, j) {
    const nodeName = getNodeName(i, j);
    // console.log(nodeName, map[i][j]);
    const connectedNodes = getConnectedNodes(i, j);
    const filteredNodes = filterNodes([i, j], connectedNodes);

    graph[nodeName] = {};

    for (const filteredNode of filteredNodes) {
        const childNodeName = getNodeName(filteredNode[0], filteredNode[1]);
        graph[nodeName][childNodeName] = 1;
    }
}


const shortestDistanceNode = (distances, visited) => {
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

let findShortestPath = (graph, startNode, endNode) => {

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

function fixLetters() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {

            if (map[i][j] == 'S') {
                startNode = getNodeName(i, j);

                map[i][j] = 'a';
            }

            if (map[i][j] == 'E') {
                endNode = getNodeName(i, j);
                map[i][j] = 'z';
            }
        }
    }
}

function createGraph() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            resolveNode(i, j);
        }
    }
}

let startNode;
let endNode;

fixLetters();
createGraph();

const results = findShortestPath(graph, startNode, endNode);
results.path = results.path.map(node => parseInt(node));

for (let i = 0; i < map.length; i++) {
    let row = '';
    for (let j = 0; j < map[i].length; j++) {
        if (results.path.includes(getNodeName(i, j))) {
            row += '\x1b[32m█\x1b[0m';
        } else {
            if (map[i][j] == 'a') {
                row += '\x1b[31m░\x1b[0m';
            } else if (map[i][j] == 'b') {
                row += '\x1b[34m░\x1b[0m';
            } else if (map[i][j] == 'c') {
                row += '\x1b[35m░\x1b[0m';
            } else if (map[i][j] == 'd') {
                row += '\x1b[36m░\x1b[0m';
            } else {
                row += '\x1b[30m░\x1b[0m';
            }
        }
    }
    console.log(row);
}

// console.log(results.path);
console.log(results.distance);