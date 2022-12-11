const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const data = input.trim().split('\n');

const overlaps = data.map(job => {
    const subJob1 = job.split(',')[0];
    const subJob2 = job.split(',')[1];

    const interval1 = subJob1.split('-').map(boundary => parseInt(boundary))
    const interval2 = subJob2.split('-').map(boundary => parseInt(boundary))

    if (interval1[0] >= interval2[0] && interval1[1] <= interval2[1]) {
        return true;
    }

    if (interval2[0] >= interval1[0] && interval2[1] <= interval1[1]) {
        return true;
    }

    return false;
})

console.dir(overlaps, { maxArrayLength: null });

const result = overlaps.reduce((a, overlap) => a + overlap, 0);

console.log(result);