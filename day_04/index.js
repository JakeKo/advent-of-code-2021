const { readFiles } = require('../utils');

class Board {
    constructor(rows) {
        this.rows = rows;
        this.marked = [];
    }

    get rowCount() {
        return this.rows.length;
    }

    get colCount() {
        return this.rows[0].length;
    }

    mark(call) {
        this.rows.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                if (this.rows[rowIndex][colIndex] === call) {
                    this.marked.push([rowIndex, colIndex]);
                }
            });
        });
    }

    isWin() {
        for (let i = 0; i < this.rowCount; i++) {
            const rowMarked = this.marked.filter(m => m[0] === i);
            if (rowMarked.length === this.rowCount) {
                return true;
            }
        }

        for (let i = 0; i < this.colCount; i++) {
            const colMarked = this.marked.filter(m => m[1] === i);
            if (colMarked.length === this.colCount) {
                return true;
            }
        }

        return false;
    }

    score(lastCall) {
        let total = 0;
        this.rows.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                const isMarked = !!this.marked.find(m => m[0] === rowIndex && m[1] === colIndex);
                if (!isMarked) {
                    total += Number.parseInt(this.rows[rowIndex][colIndex]);
                }
            });
        });

        return total * Number.parseInt(lastCall);
    }
}

(async () => {
    const [input] = await readFiles('./day_04/input.txt');
    const [callList, ...rawBoards] = input;
    const calls = callList.split(',');
    const boards1 = [];
    const boards2 = [];

    for (let i = 1; i < rawBoards.length; i += 6) {
        const rows = [
            rawBoards[i + 0].trim().split(/\s+/),
            rawBoards[i + 1].trim().split(/\s+/),
            rawBoards[i + 2].trim().split(/\s+/),
            rawBoards[i + 3].trim().split(/\s+/),
            rawBoards[i + 4].trim().split(/\s+/)
        ];
        boards1.push(new Board(rows));
        boards2.push(new Board(rows));
    }

    let i = 0;
    let winnerIndex = -1;
    while (winnerIndex === -1 && i < calls.length) {
        const call = calls[i];
        boards1.forEach(b => b.mark(call));
        winnerIndex = boards1.findIndex(b => b.isWin());
        i++;
    }

    let winner = boards1[winnerIndex];
    console.log(winner.score(calls[i - 1]));

    i = 0;
    const winnerIndices = [];
    while (winnerIndices.length < boards2.length && i < calls.length) {
        const call = calls[i];
        boards2.forEach((b, bIndex) => {
            if (!winnerIndices.includes(bIndex)) {
                b.mark(call);
                if (b.isWin()) {
                    winnerIndices.push(bIndex);
                }
            }
        });
        i++;
    }

    winner = boards2[winnerIndices[winnerIndices.length - 1]];
    console.log(winner.score(calls[i - 1]));
})();