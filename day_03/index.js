const { readFiles } = require('../utils');

function mostCommonBit(list, index) {
    const sum = list.reduce((total, line) => total + line[index], 0);
    return Math.round(sum / list.length);
}

(async () => {
    const [input] = await readFiles('./day_03/input.txt');
    const data = input.map(x => x.split('').map(n => Number.parseInt(n)));

    const gammaBits = [...Array(data[0].length)].map((_, i) => mostCommonBit(data, i));
    const epsilonBits = gammaBits.map(x => 1 - x);

    const gamma = Number.parseInt(gammaBits.join(''), 2);
    const epsilon = Number.parseInt(epsilonBits.join(''), 2);

    console.log(gamma * epsilon);

    let o2Data = data, o2Index = 0;
    let co2Data = data, co2Index = 0;

    while (o2Data.length > 1) {
        const bit = mostCommonBit(o2Data, o2Index);
        o2Data = o2Data.filter(line => line[o2Index] === bit);
        o2Index++;
    }

    while (co2Data.length > 1) {
        const bit = 1 - mostCommonBit(co2Data, co2Index);
        co2Data = co2Data.filter(line => line[co2Index] === bit);
        co2Index++;
    }

    const o2Rate = Number.parseInt(o2Data[0].join(''), 2);
    const co2Rate = Number.parseInt(co2Data[0].join(''), 2);
    console.log(o2Rate * co2Rate);
})();