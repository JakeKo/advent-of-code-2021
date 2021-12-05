const { readFiles } = require('../utils');

function stringifyMap(map) {
    return map.map(row => {
        return row.map(p => p === 0 ? '.' : p).join('');
    }).join('\n');
}

function calculateMap(data) {
    const maxX = Math.max(...data.flatMap(p => [p.x1, p.x2])) + 1;
    const maxY = Math.max(...data.flatMap(p => [p.y1, p.y2])) + 1;

    const map = [];
    for (let i = 0; i < maxY; i++) {
        map.push(Array(maxX).fill(0));
    }

    data.forEach(p => {
        const xSign = Math.sign(p.x2 - p.x1);
        const ySign = Math.sign(p.y2 - p.y1);

        let z = { x: p.x1, y: p.y1 };
        do {
            map[z.y][z.x]++;

            z.x += xSign;
            z.y += ySign;
        } while (z.x !== p.x2 || z.y !== p.y2)
        map[z.y][z.x]++;
    });

    return map;
}

function countOverlaps(map) {
    let overlaps = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] > 1) {
                overlaps++;
            }
        }
    }

    return overlaps;
}

(async () => {
    const [input] = await readFiles('./day_05/input.txt');
    const data = input.map(line => {
        const stringCoords = line.split(' -> ');
        const [x1, y1] = stringCoords[0].split(',');
        const [x2, y2] = stringCoords[1].split(',');
        return {
            x1: Number.parseInt(x1),
            y1: Number.parseInt(y1),
            x2: Number.parseInt(x2),
            y2: Number.parseInt(y2)
        };
    });

    const map1 = calculateMap(data.filter(p => p.x1 === p.x2 || p.y1 === p.y2));
    console.log(countOverlaps(map1));

    const map2 = calculateMap(data);
    console.log(countOverlaps(map2));
})();