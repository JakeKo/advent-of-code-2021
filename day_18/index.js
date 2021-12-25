const { readFiles } = require('../utils');

function calculateDepth(node) {
    let depth = 0;
    while (node.parent) {
        node = node.parent;
        depth++;
    }

    return depth;
}

function explode(node) {
    const depth = calculateDepth(node);
    if (depth >= 4 && node.type === 'element' && node.left.type === 'value' && node.right.type === 'value') {
        const leftValue = node.left.value;
        const rightValue = node.right.value;

        node.type = 'value';
        node.value = 0;
        delete node.left;
        delete node.right;

        let searchNode = node;
        while (searchNode.parent && searchNode.parent.left === searchNode) {
            searchNode = searchNode.parent;
        }

        if (searchNode.parent) {
            searchNode = searchNode.parent.left;
            while (searchNode.right) {
                searchNode = searchNode.right;
            }
    
            searchNode.value += leftValue;
        }

        searchNode = node;
        while (searchNode.parent && searchNode.parent.right === searchNode) {
            searchNode = searchNode.parent;
        }

        if (searchNode.parent) {
            searchNode = searchNode.parent.right;
            while (searchNode.left) {
                searchNode = searchNode.left;
            }
    
            searchNode.value += rightValue;
        }

        return true;
    }


    return false;
}

function split(node) {
    if (node.type === 'value' && node.value >= 10) {
        node.type = 'element';
        node.left = { parent: node, type: 'value', value: Math.floor(node.value / 2) };
        node.right = { parent: node, type: 'value', value: Math.ceil(node.value / 2) };
        delete node.value;

        return true;
    }

    return false;
}

function tryExplode(node) {
    let exploded = explode(node);

    if (!exploded && node.type === 'element') {
        exploded = tryExplode(node.left) || tryExplode(node.right);
    }

    return exploded;
}

function trySplit(node) {
    let splitted = split(node);

    if (!splitted && node.type === 'element') {
        splitted = trySplit(node.left) || trySplit(node.right);
    }

    return splitted;
}

function reduce(tree) {
    let changed = true;
    while (changed) {
        changed = tryExplode(tree) || trySplit(tree);
    }

    return tree;
}

function stringify(data) {
    function s(node) {
        if (node.type === 'element') {
            return [s(node.left), s(node.right)];
        } else {
            return node.value;
        }
    }

    return JSON.stringify(s(data));
}

function add(a, b) {
    const tree = { type: 'element', left: a, right: b };
    a.parent = tree;
    b.parent = tree;

    reduce(tree);

    return tree;
}

function calculateMagnitude(node) {
    if (node.type === 'element') {
        return 3 * calculateMagnitude(node.left) + 2 * calculateMagnitude(node.right);
    } else {
        return node.value;
    }
}

function parseInput(input) {
    return input.map(line => JSON.parse(line)).map(line => {
        function parse(node, item) {
            if (Array.isArray(item)) {
                node.type = 'element';
                node.left = { parent: node };
                node.right = { parent: node };

                parse(node.left, item[0]);
                parse(node.right, item[1]);
            } else {
                node.type = 'value';
                node.value = item;
            }
        }

        const tree = {};
        parse(tree, line);

        return tree;
    });
}

(async () => {
    const [input] = await readFiles('./day_18/input.txt');
    const data = parseInput(input);

    let sum = data[0];
    data.slice(1).forEach(line => { sum = add(sum, line); });
    console.log(calculateMagnitude(sum));

    const allSums = [];
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            allSums.push(add(parseInput(input)[i], parseInput(input)[j]));
            allSums.push(add(parseInput(input)[j], parseInput(input)[i]));
        }
    }

    const allMagnitudes = allSums.map(s => calculateMagnitude(s));
    console.log(Math.max(...allMagnitudes));
})();