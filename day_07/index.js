const { readFiles } = require('../utils');

function calculateDistance (crabs, position) {
    return crabs.map(c => Math.abs(c - position))
        .reduce((total, val) => total + val, 0);
}

function calculateAdditiveDistance (crabs, position) {
    return crabs.map(c => {
        const diff = Math.abs(c - position);
        return diff * (diff + 1) / 2;
    }).reduce((total, val) => total + val, 0);
}

function minimizeDistance(crabs, calc) {
    let min = 0, max = Math.max(...crabs) - 1;
    let found = false, p = Math.floor(max / 2);

    while (!found) {
        const lo = calc(crabs, p - 1);
        const val = calc(crabs, p);

        if (lo < val) {
            max = p;
            p = Math.floor((p + min) / 2);
        } else if (lo > val) {
            const hi = calc(crabs, p + 1);
            if (hi > val) {
                found = true;
            } else {
                min = p;
                p = Math.floor((p + max) / 2);
            }
        }
    }

    return { p, distance: calc(crabs, p) };
}

(async () => {
    const [input] = await readFiles('./day_07/input.txt');
    const data = input[0].split(',').map(x => Number.parseInt(x));

    const { distance: d1 } = minimizeDistance(data, calculateDistance)
    console.log(d1);
    
    const { distance: d2 } = minimizeDistance(data, calculateAdditiveDistance)
    console.log(d2);
})();