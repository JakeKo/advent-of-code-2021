const { readFiles } = require('../utils');

const DIGIT_COUNT = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
const DIGIT_BINARY = {
    '1110111': '0',
    '0010010': '1',
    '1011101': '2',
    '1011011': '3',
    '0111010': '4',
    '1101011': '5',
    '1101111': '6',
    '1010010': '7',
    '1111111': '8',
    '1111011': '9'
};

function countInstancesOfUniqueDigits(data) {
    let count = 0;
    const UNIQUE_DIGIT_COUNT = [
        DIGIT_COUNT[1],
        DIGIT_COUNT[4],
        DIGIT_COUNT[7],
        DIGIT_COUNT[8]
    ];

    data.forEach(({ code }) => {
        const uniqueDigits = code.filter(c => UNIQUE_DIGIT_COUNT.includes(c.length));
        count += uniqueDigits.length;
    });

    return count;
}

function decodeOutput (output, map) {
    let total = '';
    output.forEach(code => {
        const bin = Array(7).fill(0);
        code.split('').forEach(d => {
            bin[[map[d]]] = 1;
        });

        total += DIGIT_BINARY[bin.join('')];
    });

    return Number.parseInt(total)
}

function createDraftMap () {
    return 'abcdefg'.split('').reduce((draftMap, letter) => ({
        ...draftMap,
        [letter]: new Set([...Array(7)].map((_,i ) => i))
    }), {});
}

function createMap (draftMap) {
    return Object.entries(draftMap).reduce((newMap, [key, value]) => ({
        ...newMap,
        [key]: value.values().next().value
    }), {});
}

function filterMap (draftMap) {
    let i = 0;
    while (Object.values(draftMap).some(x => x.size > 1) && i++ < 10) {
        Object.entries(draftMap).forEach(([k1, v1]) => {
            if (v1.size === 1) {
                const v = v1.values().next().value;
                Object.keys(draftMap).forEach(k2 => {
                    if (k2 !== k1) {
                        draftMap[k2].delete(v);
                    }
                });
            }
        });

        Object.entries(draftMap).forEach(([k1, v1]) => {
            v1.forEach(v => {
                const isElsewhere = Object.entries(draftMap).some(([k2, v2]) => {
                    return k2 !== k1 && v2.has(v);
                });

                if (!isElsewhere) {
                    draftMap[k1] = new Set([v]);
                }
            });
        });
    }
}

function intersect (s1, s2) {
    return new Set([...s1].filter(x => s2.has(x)));
}

function decodeInput (input) {
    let draftMap = createDraftMap();

    const oneCode = input.find(x => x.length === DIGIT_COUNT[1]);
    oneCode.split('').forEach(digit => {
        draftMap[digit] = intersect([2, 5], draftMap[digit]);
    });

    const fourCode = input.find(x => x.length === DIGIT_COUNT[4]);
    fourCode.split('').forEach(digit => {
        draftMap[digit] = intersect([1, 2, 3, 5], draftMap[digit]);
    });

    const sevenCode = input.find(x => x.length === DIGIT_COUNT[7]);
    sevenCode.split('').forEach(digit => {
        draftMap[digit] = intersect([0, 2, 5], draftMap[digit]);
    });

    const fiveDigitCodes = input.filter(x => x.length === 5);
    const fiveDigitCounts = 'abcdefg'.split('').reduce((c, l) => ({ ...c, [l]: 0 }), {});
    fiveDigitCodes.forEach(code => {
        code.split('').forEach(digit => {
            fiveDigitCounts[digit]++;
        });
    });
    Object.entries(fiveDigitCounts).forEach(([key, value]) => {
        if (value === 3) {
            draftMap[key] = intersect([0, 3, 6], draftMap[key]);
        } else if (value === 2) {
            draftMap[key] = intersect([2, 5], draftMap[key]);
        } else if (value === 1) {
            draftMap[key] === intersect([1, 4], draftMap[key]);
        }
    });

    const sixDigitCodes = input.filter(x => x.length === 6);
    const sixDigitCounts = 'abcdefg'.split('').reduce((c, l) => ({ ...c, [l]: 0 }), {});
    sixDigitCodes.forEach(code => {
        code.split('').forEach(digit => {
            sixDigitCounts[digit]++;
        });
    });
    Object.entries(sixDigitCounts).forEach(([key, value]) => {
        if (value === 3) {
            draftMap[key] = intersect([0, 1, 5, 6], draftMap[key]);
        } else if (value === 2) {
            draftMap[key] = intersect([2, 3, 4], draftMap[key]);
        }
    });

    filterMap(draftMap);
    return createMap(draftMap);
}

(async () => {
    const [input] = await readFiles('./day_08/input.txt');
    const data = input.map(line => {
        const [display, code] = line.split(' | ');
        return {
            display: display.split(' '),
            code: code.split(' ')
        }
    });

    const uniqueDigitCount = countInstancesOfUniqueDigits(data);
    console.log(uniqueDigitCount);

    let total = 0;
    data.forEach(line => {
        const map = decodeInput(line.display);
        const output = decodeOutput(line.code, map);
        total += output;
    });

    console.log(total);
})();