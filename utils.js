const fs = require('fs');

async function readFiles(...filePaths) {
    return Promise.all(filePaths.map(path => {
        return new Promise(resolve => {
            fs.readFile(path, 'utf-8', (_, data) => {
                resolve(data.split('\n'));
            });
        });
    }));
}

module.exports = {
    readFiles
};
