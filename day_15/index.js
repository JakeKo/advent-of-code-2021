const { readFiles } = require('../utils');

function getNeighbors(data, position) {
    const [x, y] = position;
    const neighbors = [
        [x, y - 1],
        [x + 1, y],
        [x, y + 1],
        [x - 1, y]
    ];

    return neighbors.filter(([x, y]) =>
        x >= 0 && y >= 0 &&
        x < data[0].length && y < data.length
    );
}

function findPath(data) {
    const costs = data.map(r => r.map(() => Infinity));
    costs[0][0] = 0;
    const queue = [[0, 0]];

    while (queue.length > 0) {
        const node = queue.shift();
        getNeighbors(data, node).forEach(n => {
            const nCost = costs[node[1]][node[0]] + data[n[1]][n[0]];
            if (nCost < costs[n[1]][n[0]]) {
                costs[n[1]][n[0]] = nCost;
                queue.push(n);
            }
        });
    }

    return costs[costs.length - 1][costs[costs.length - 1].length - 1];
}

(async () => {
    const [input] = await readFiles('./day_15/input.txt');
    const data1 = input.map(line => line.split('').map(x => Number.parseInt(x)));
    const cost1 = findPath(data1);
    console.log(cost1);
    
    const data2 = [];
    for (let i = 0; i < 5; i++) {
        const dataGroup = data1.map(row => {
            const newRow = [];
            for (let j = 0; j < 5; j++) {
                newRow.push(...row.map(x => {
                    let val = x + i + j;
                    if (val > 9) {
                        val = val % 9;
                    }

                    return val;
                }));
            }

            return newRow;
        });

        data2.push(...dataGroup);
    }

    const cost2 = findPath(data2);
    console.log(cost2);
})();