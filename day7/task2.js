const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const operations = input.match(/(\$[ \w+\n.\/]+)/gm);

class Tree {
    constructor(rootNode) {
        this.root = rootNode;
    }
}

class Node {
    constructor(parent, name, type, size) {
        this.parent = parent;
        this.name = name;
        this.type = type;
        this.size = parseInt(size);
        this.children = [];
    }

    addChild(node) {
        this.children.push(node);
    }

    getChild(name) {
        return this.children.find(childNode => childNode.name === name);
    }
}

class FileNode extends Node {
    constructor(parent, name, size) {
        super(parent, name, 'file', size)
    }
}

class DirNode extends Node {
    constructor(parent, name, size) {
        super(parent, name, 'dir', size)
    }
}

const rootNode = new DirNode(null, '/', null);
const tree = new Tree(rootNode);
let currentNode = rootNode;


for (const operation of operations) {
    const lines = operation.split('\n').filter(command => command);
    const command = lines[0].slice(2, lines[0].length);
    const program = command.split(' ')[0];

    switch (program) {
        case 'ls':
            handleDirList(lines.slice(1, lines.length));
            break;
        case 'cd':
            handleDirChange(command.split(' ')[1]);
            break;
        default:
            throw new Error(`unknown command program (${program})`);
    }
}

function handleDirList(items) {
    for (const item of items) {
        const data = item.split(' ');

        switch (data[0]) {
            case 'dir':
                const dirNode = new DirNode(currentNode, data[1], null);
                currentNode.addChild(dirNode);
                break;
            default:
                const fileNode = new FileNode(currentNode, data[1], data[0]);
                currentNode.addChild(fileNode);
                break;
        }

    }
}

function handleDirChange(dir) {
    switch (dir) {
        case '/':
            currentNode = rootNode;
            break;
        case '..':
            currentNode = currentNode.parent;
            break;
        default:
            currentNode = currentNode.getChild(dir);
            break;
    }
}

function calculateDirSizes(node) {
    let size = 0;

    if (node.children.length === 0 && node.type === 'dir') {
        node.size = 0;
    }

    if (node.children.length > 0 && node.type === 'dir') {
        node.size = node.children.reduce((sum, child) => sum + calculateDirSizes(child), 0);
        size += node.size;
    }

    if (node.type === 'file') {
        size += node.size;
    }

    return size;
}

calculateDirSizes(tree.root);

const totalSpace = 70000000;
const neededSpace = 30000000;
const cleanup = neededSpace - (totalSpace - tree.root.size);
let result = 999999999999999;


function calculateResult(node) {
    for (const child of node.children) {
        if (child.type === 'dir' && child.size >= cleanup) {
            if (child.size < result) {
                result = child.size;
            }

            calculateResult(child);
        }
    }
}




calculateResult(tree.root);

console.log(result);
