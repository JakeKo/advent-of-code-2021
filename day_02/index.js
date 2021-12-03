const { readFiles } = require('../utils');

(async () => {
    const [input] = await readFiles('./day_02/input.txt');
    const data = input.map(x => {
        const split = x.split(' ');
        return { command: split[0], value: Number.parseInt(split[1]) };
    });

    let depth = 0;
    let distance = 0;

    data.forEach(({ command, value }) => {
        if (command === 'forward') {
            distance += value;
        } else if (command === 'down') {
            depth += value;
        } else if (command === 'up') {
            depth -= value;
        }
    });

    console.log(depth * distance);

    depth = 0;
    distance = 0;
    let aim = 0;

    data.forEach(({ command, value }) => {
        if (command === 'forward') {
            distance += value;
            depth += aim * value;
        } else if (command === 'down') {
            aim += value;
        } else if (command === 'up') {
            aim -= value;
        }
    });

    console.log(depth * distance);
})();