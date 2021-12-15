const { readFiles } = require('../utils');

function makeGraphList(data) {
    const graphList = {};

    data.forEach(({ n1, n2 }) => {
        graphList[n1] = [...(graphList[n1] ?? []), n2];
        graphList[n2] = [...(graphList[n2] ?? []), n1];
    });

    return graphList;
}

function isSmallCave(name) {
    return name.toLowerCase() === name;
}

function getPath(node) {
    const path = [node.tag];
    while (node.parent) {
        node = node.parent;
        path.push(node.tag);
    }

    return path.reverse();
}

function countPaths(node) {
    let count = 0;
    node.children.forEach(n => {
        if (n.tag === 'end') {
            count++;
        } else {
            count += countPaths(n);
        }
    });

    return count;
}

function isValidConnection(path, connection) {
    if (isSmallCave(connection)) {
        if (connection === 'start') {
            return false;
        } else {
            const smallCaves = {};
            [...path, connection].forEach(c => {
                if (isSmallCave(c)) {
                    smallCaves[c] = (smallCaves[c] ?? 0) + 1;
                }
            });

            let revisited = 0, max = 0;
            Object.values(smallCaves).forEach(v => {
                if (v > max) max = v;
                if (v > 1) revisited++;
            });

            return revisited < 2 && max < 3;
        }
    } else {
        return true;
    }
}

(async () => {
    const [input] = await readFiles('./day_12/input.txt');
    const data = input.map(line => {
        const [n1, n2] = line.split('-');
        return { n1, n2 };
    });

    const graphList = makeGraphList(data);
    const paths = { children: [], tag: 'start' }
    const leaves = [paths];

    while (leaves.length > 0) {
        // Pop leaf
        const leaf = leaves.shift();
        const path = getPath(leaf);

        // Get its connections
        const connections = graphList[leaf.tag];

        // Filter connections (remove revisited small caves)
        const validConnections = connections
            .filter(c => !isSmallCave(c) || !path.includes(c))
            .map(c => ({ parent: leaf, children: [], tag: c }));
        
        // Add connections as leaves to paths
        leaf.children = validConnections;

        // Filter new leaves (remove end leaf)
        const newLeaves = leaf.children.filter(n => n.tag !== 'end')

        // Add filtered list of leaves to leaves
        leaves.push(...newLeaves);
    }

    console.log(countPaths(paths));

    const paths2 = { children: [], tag: 'start' }
    const leaves2 = [paths2];
    let i = 0;

    while (leaves2.length > 0) {
        // Pop leaf
        const leaf = leaves2.shift();
        const path = getPath(leaf);

        // Get its connections
        const connections = graphList[leaf.tag];

        // Filter connections (remove revisited small caves)
        const validConnections = connections
            .filter(c => isValidConnection(path, c))
            .map(c => ({ parent: leaf, children: [], tag: c }));
        
        // Add connections as leaves to paths
        leaf.children = validConnections;

        // Filter new leaves (remove end leaf)
        const newLeaves = leaf.children.filter(n => n.tag !== 'end')

        // Add filtered list of leaves to leaves
        leaves2.push(...newLeaves);
    }

    console.log(countPaths(paths2));
})();