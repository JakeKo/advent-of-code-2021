const { readFiles } = require('../utils');

function findBasin(data, [i, j]) {
    const serialize = (i, j) => `${i},${j}`;
    const basin = new Set([]);
    const seen = [[i, j]];
    const visited = new Set();

    while (seen.length > 0) {
        const [I, J] = seen.shift();
        const neighbors = [[I, J - 1], [I, J + 1], [I - 1, J], [I + 1, J]]
            .filter(([ni, nj]) => data[ni]?.[nj] !== undefined &&
                data[ni][nj] !== 9 &&
                !visited.has(serialize(ni, nj))
            );
        
        basin.add(serialize(I, J));
        seen.push(...neighbors);
        visited.add(serialize(I, J));
    }

    return basin;
}

(async () => {
    const [input] = await readFiles('./day_09/input.txt');
    const data = input.map(line => line.split('').map(x => Number.parseInt(x)));

    const lowest = [];
    const lowestIndices = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const neighbors = [
                data[i]?.[j - 1],
                data[i]?.[j + 1],
                data[i - 1]?.[j],
                data[i + 1]?.[j]
            ].filter(n => n !== undefined);

            if (neighbors.every(n => n > data[i][j])) {
                lowest.push(data[i][j]);
                lowestIndices.push([i, j]);
            }
        }
    }

    const risk = lowest.reduce((total, val) => total + val + 1, 0);
    console.log(risk);

    const basins = lowestIndices.map(indices => findBasin(data, indices));
    const basinSizes = basins.map(b => b.size).sort((a, b) => a > b ? -1 : 1);
    const product = basinSizes[0] * basinSizes[1] * basinSizes[2];
    console.log(product);
})();
