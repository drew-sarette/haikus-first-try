const fs = require('fs');
const FILE_NAME = "server/assets/wordList.json";

const wordRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_NAME, function(err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    }
};

module.exports = wordRepo;