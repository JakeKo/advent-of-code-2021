const { readFiles } = require('../utils');

function findXVelocities(region) {
    const maxX = region[1].x;
    let minX = 1;

    while (minX * (minX + 1) < region[0].x) {
        minX++;
    }

    return [minX, maxX];
}

function findYVelocities(region) {
    const minY = region[1].y;
    const maxY = Math.abs(region[1].y) - 1;

    return [minY, maxY];
}

function isValidVelocity(r, v) {
    let diff = 0;
    let p = { ...v };

    while (true) {
        if (r[0].x <= p.x && p.x <= r[1].x && r[0].y >= p.y && p.y >= r[1].y) {
            return true;
        } else if (p.x > r[1].x || p.y < r[1].y) {
            return false;
        }

        diff++;
        p.x += Math.max(v.x - diff, 0);
        p.y += v.y - diff;
    }
}

(async () => {
    const [input] = await readFiles('./day_17/input.txt');
    const data = input[0].slice(13).split(', ').map(coord => {
        const range = coord.slice(2).split('..');
        return range.map(n => Number.parseInt(n));
    });
    const region = [
        { x: data[0][0], y: data[1][1] },
        { x: data[0][1], y: data[1][0] }
    ];

    const maxY = Math.abs(region[1].y) - 1;
    const maxHeight = maxY * (maxY + 1) / 2;
    console.log(maxHeight);

    const xVelocities = findXVelocities(region);
    const yVelocities = findYVelocities(region);
    const allVelocities = [];
    for (let x = xVelocities[0]; x <= xVelocities[1]; x++) {
        for (let y = yVelocities[0]; y <= yVelocities[1]; y++) {
            allVelocities.push({ x, y });
        }
    }

    const validVelocities = allVelocities.filter(v => isValidVelocity(region, v));
    console.log(validVelocities.length);
})();