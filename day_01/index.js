const { readFiles } = require('../utils');

(async () => {
    const [input] = await readFiles('./day_01/input_a.txt');
    const data = input.map(x => Number.parseInt(x));

    let increases = 0;
    for (let i = 0; i < data.length - 1; i++) {
        if (data[i] < data[i + 1]) {
            increases++;
        }
    }

    console.log(increases);

    const sums = [];
    for (let i = 0; i < data.length - 2; i++) {
        sums.push(data[i] + data[i + 1] + data[i + 2]);
    }

    let sum_increases = 0;
    for (let i = 0; i < sums.length - 1; i++) {
        if (sums[i] < sums[i + 1]) {
            sum_increases++;
        }
    }

    console.log(sum_increases);
})();