const { readFiles } = require('../utils');

class Lanternfish {
    constructor(days = 8) {
        this.days = days;
    }

    tick() {
        if (this.days === 0) {
            this.days = 6;
            return true;
        } else {
            this.days--;
            return false;
        }
    }
}

(async () => {
    const [input] = await readFiles('./day_06/input.txt');
    const data = input[0].split(',').map(x => Number.parseInt(x));
    const fish1 = data.map(days => new Lanternfish(days));
    let days = 80;

    for (let i = 0; i < days; i++) {
        const newFish = [];
        fish1.forEach(f => {
            const spawn = f.tick();
            if (spawn) {
                newFish.push(new Lanternfish());
            }
        });

        fish1.push(...newFish);
    }

    console.log(fish1.length);

    let fish2 = data.reduce((F, f) => ({ ...F, [f]: (F[f] ?? 0) + 1 }), {});
    days = 256;
    for (let i = 0; i < days; i++) {
        const newFish = {};
        for (let j = 1; j <= 8; j++) {
            newFish[j - 1] = fish2[j] ?? 0;
        }

        newFish[8] = fish2[0] ?? 0;
        newFish[6] += (fish2[0] ?? 0);
        fish2 = newFish;
    }

    const count = Object.values(fish2).reduce((total, value) => total + value, 0);
    console.log(count);
})();