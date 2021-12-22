const { readFiles } = require('../utils');

function hex2bin(hex){
    return (parseInt(hex, 16).toString(2)).padStart(4, '0');
}

(async () => {
    const [input] = await readFiles('./day_16/input.txt');
    const data = input[0].split('').map(x => hex2bin(x)).join('');

    let versionSum = 0;
    let i = 0;
    let total = 0;
    while (i < data.length) {
        total = parsePacket();

        while (!Number.isInteger(Math.log2(i))) {
            i++;
        }
    }

    function parsePacket() {
        const version = Number.parseInt(data.slice(i, i + 3), 2);
        const typeId = Number.parseInt(data.slice(i + 3, i + 6), 2);
        versionSum += version;
        i += 6;

        // Parse literal value
        if (typeId === 4) {
            let literalValue = '';
            while (data[i] === '1') {
                literalValue += data.slice(i + 1, i + 5);
                i += 5;
            }

            literalValue += data.slice(i + 1, i + 5);
            i += 5;

            return Number.parseInt(literalValue, 2);
        } else {
            const values = [];
            const lengthTypeId = Number.parseInt(data[i], 2);
            i += 1

            if (lengthTypeId === 0) {
                const subpacketLength = Number.parseInt(data.slice(i, i + 15), 2);
                i += 15;
                const subpackI = i + subpacketLength;
                while (i < subpackI) {
                    values.push(parsePacket());
                }
            } else if (lengthTypeId === 1) {
                const subpacketCount = Number.parseInt(data.slice(i, i + 11), 2);
                i += 11;
                let count = 0;

                while (count++ < subpacketCount) {
                    values.push(parsePacket());
                }
            }

            if (typeId === 0) {
                return values.reduce((total, value) => total + value, 0);
            } else if (typeId === 1) {
                return values.reduce((total, value) => total * value, 1);
            } else if (typeId === 2) {
                return Math.min(...values);
            } else if (typeId === 3) {
                return Math.max(...values);
            } else if (typeId === 5) {
                return values[0] > values[1] ? 1 : 0;
            } else if (typeId === 6) {
                return values[0] < values[1] ? 1 : 0;
            } else if (typeId === 7) {
                return values[0] === values[1] ? 1 : 0;
            }
        }
    }

    console.log(versionSum);
    console.log(total);
})();
