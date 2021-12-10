const { readFiles } = require('../utils');

const OPENERS = ['[', '{', '(', '<'];
const CLOSERS = [']', '}', ')', '>'];
const POINTS = {
    ')': 3,
    '}': 1197,
    ']': 57,
    '>': 25137
}
const COMPLETION_POINTS = {
    '}': 3,
    ')': 1,
    ']': 2,
    '>': 4
}

function getCloser(opener) {
    return {
        '[': ']',
        '{': '}',
        '(': ')',
        '<': '>'
    }[opener];
}

function isCorrupted(line) {
    const stack = [];

    for (let i = 0; i < line.length; i++) {
        if (OPENERS.includes(line[i])) {
            stack.push(line[i]);
        } else if (CLOSERS.includes(line[i])) {
            const expected = getCloser(stack[stack.length - 1]);
            const actual = line[i];
            if (actual === expected) {
                stack.pop();
            } else {
                return { corrupted: true, expected, actual, index: i };
            }
        }
    }

    return { corrupted: false };
}

function completeLine(line) {
    const stack = [];

    for (let i = 0; i < line.length; i++) {
        if (OPENERS.includes(line[i])) {
            stack.push(line[i]);
        } else if (CLOSERS.includes(line[i])) {
            stack.pop();
        }
    }

    const completion = stack.reverse().map(opener => getCloser(opener)).join('');
    return completion;
}

function scoreCompletion(completion) {
    let score = 0;
    completion.split('').forEach(c => {
        score *= 5;
        score += COMPLETION_POINTS[c];
    });

    return score;
}

(async () => {
    const [input] = await readFiles('./day_10/input.txt');
    const data = input.map(line => line.split(''));

    let corruptionScore = 0;
    data.forEach(line => {
        const { corrupted, actual } = isCorrupted(line);
        if (corrupted) {
            corruptionScore += POINTS[actual];
        }
    });

    console.log(corruptionScore);

    const scores = [];
    data.forEach(line => {
        const { corrupted } = isCorrupted(line);
        if (!corrupted) {
            const completion = completeLine(line);
            scores.push(scoreCompletion(completion));
        }
    });

    const sortedScores = scores.sort((a, b) => a < b ? -1 : 1);
    const middleScore = sortedScores[Math.floor(sortedScores.length / 2)];

    console.log(middleScore);
})();