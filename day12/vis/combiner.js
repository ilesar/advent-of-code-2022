
const fs = require('fs');

const output2 = fs.readFileSync(`${__dirname}/output2.csv`, "utf-8");
const output3 = fs.readFileSync(`${__dirname}/output3.csv`, "utf-8");

const data2 = output2.split('\n').map(row => row.split(','));
const data3 = output3.split('\n').map(row => row.split(','));
const outputData = [['x', 'y', 'height', 'path', 'shortcut']];

for (let i = 1; i < data3.length; i++) {
    outputData.push([
        data2[i][0],
        data2[i][1],
        data2[i][2],
        data2[i][3],
        data3[i][3],
    ])
}

const output = outputData.map(row => row.join(',')).join('\n')

fs.writeFileSync('vis/output4.csv', output);