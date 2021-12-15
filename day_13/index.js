const { readFiles } = require('../utils');

// n - (x mod n) mod n

function makeDotMap(dots) {
    const xMax = Math.max(...dots.map(d => d.x));
    const yMax = Math.max(...dots.map(d => d.y));

    const dotMap = [];
    for (let y = 0; y <= yMax; y++) {
        dotMap.push([]);
        for (let x = 0; x <= xMax; x++) {
            dotMap[y].push(false);
        }
    }

    dots.forEach(d => {
        dotMap[d.y][d.x] = true;
    });

    return dotMap;
}

function fold(dots, f) {
    if ('x' in f) {
        return dots.map(d => {
            return { x: f.x < d.x ? (f.x - (d.x % f.x)) % f.x : d.x, y: d.y };
        })
    } else if ('y' in f) {
        return dots.map(d => {
            return { x: d.x, y: f.y < d.y ? (f.y - (d.y % f.y)) % f.y : d.y };
        })
    }
}

function stringifyDotMap(dotMap) {
    return dotMap.map(r => r.map(v => v ? '#' : '.').join('')).join('\n');
}

function countDots(dots) {
    const s = new Set();
    dots.forEach(d => {
        s.add(`${d.x}, ${d.y}`);
    });

    return s.size;
}

(async () => {
    const [input] = await readFiles('./day_13/input.txt');
    const split = input.findIndex(v => v === '');
    const dots = input.slice(0, split).map(d => {
        const split = d.split(',');
        return { x: Number.parseInt(split[0]), y: Number.parseInt(split[1]) };
    });
    const folds = input.slice(split + 1).map(f => {
        const split = f.split('fold along ')[1].split('=');
        return { [split[0]]: Number.parseInt(split[1]) };
    });

    const d1 = fold(dots, folds[0]);
    console.log(countDots(d1));

    let d2 = dots;
    folds.forEach(f => {
        d2 = fold(d2, f);
    });

    const dotMap = makeDotMap(d2);
    console.log(stringifyDotMap(dotMap));
})();