const { readFiles } = require('../utils');

function scorePolymer(p) {
    const counts = {};
    p.forEach(c => {
        counts[c] = (counts[c] ?? 0) + 1
    });

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));

    return max - min;
}

function scorePolymerObject(p) {
    const counts = {};
    Object.entries(p).forEach(([k, v]) => {
        const split = k.split('');
        counts[split[0]] = (counts[split[0]] ?? 0) + v;
        counts[split[1]] = (counts[split[1]] ?? 0) + v;
    });

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));

    return (max - min - 1) / 2;
}

(async () => {
    const [input] = await readFiles('./day_14/input.txt');
    const template = input[0];
    const instructions = Object.fromEntries(input.slice(2).map(i =>  i.split(' -> ')));

    let p1 = template.split('');
    const steps = 10;
    for (let i = 0; i < steps; i++) {
        let newP1 = [];

        for (let j = 0; j < p1.length - 1; j++) {
            const pair = `${p1[j]}${p1[j + 1]}`;
            newP1.push(p1[j]);
            newP1.push(instructions[pair]);
        }

        newP1.push(p1[p1.length - 1]);
        p1 = newP1;
    }

    const score = scorePolymer(p1);
    console.log(score);

    let counts = {};
    for (let i = 0; i < template.length - 1; i++) {
        const key = `${template[i]}${template[i + 1]}`;
        counts[key] = (counts[key] ?? 0) + 1;
    }

    const instMap = Object.fromEntries(Object.entries(instructions).map(([k, v]) => {
        const split = k.split('');
        return [k, [`${split[0]}${v}`, `${v}${split[1]}`]]
    }));
    const steps2 = 40;
    for (let i = 0; i < steps2; i++) {
        const newCounts = {};
        Object.entries(counts).forEach(([k, v]) => {
            instMap[k].forEach(k2 => {
                newCounts[k2] = (newCounts[k2] ?? 0) + v;
            });
        });

        counts = newCounts;
    }

    console.log(scorePolymerObject(counts));
})();