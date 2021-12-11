const { readFiles } = require('../utils');

function hasFlashCandidates(o) {
    return o.some(x => x.some(y => y >= 10));
}

function propagateFlash(F, o, j, k) {
    const coords = [
        [j - 1, k - 1],
        [j - 1, k],
        [j - 1, k + 1],
        [j, k - 1],
        [j, k + 1],
        [j + 1, k - 1],
        [j + 1, k],
        [j + 1, k + 1]
    ];

    coords.forEach(([J, K]) => {
        if (!F.has(JSON.stringify([J, K])) && o[J]?.[K] !== undefined) {
            o[J][K]++;
        }
    });
}

function synced(o) {
    return o.every(x => x.every(y => y === 0));
}

(async () => {
    const [input] = await readFiles('./day_11/input.txt');
    const data = input.map(line => line.split('').map(c => Number.parseInt(c)));

    const days = 100;
    let flashes = 0;
    const o1 = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < days; i++) {
        for (let j = 0; j < o1.length; j++) {
            for (let k = 0; k < o1[j].length; k++) {
                o1[j][k]++;
            }
        }

        const F = new Set();
        while (hasFlashCandidates(o1)) {
            for (let j = 0; j < o1.length; j++) {
                for (let k = 0; k < o1[j].length; k++) {
                    if (o1[j][k] >= 10) {
                        o1[j][k] = 0;
                        flashes++;
                        F.add(JSON.stringify([j, k]));
                        propagateFlash(F, o1, j, k);
                    }
                }
            }
        }
    }

    console.log(flashes);

    let syncDays = 0;
    const o2 = JSON.parse(JSON.stringify(data));
    while (!synced(o2)) {
        for (let j = 0; j < o2.length; j++) {
            for (let k = 0; k < o2[j].length; k++) {
                o2[j][k]++;
            }
        }

        const F = new Set();
        while (hasFlashCandidates(o2)) {
            for (let j = 0; j < o2.length; j++) {
                for (let k = 0; k < o2[j].length; k++) {
                    if (o2[j][k] >= 10) {
                        o2[j][k] = 0;
                        flashes++;
                        F.add(JSON.stringify([j, k]));
                        propagateFlash(F, o2, j, k);
                    }
                }
            }
        }

        syncDays++;
    }

    console.log(syncDays);
})();