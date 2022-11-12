
const fs = require('fs');
const FILE_NAME = "./assets/wordList.json";
const axios = require("axios");
require('dotenv').config();


const wordRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        });
    },
    lookUpWord: function (word, resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                word.toLowerCase();
                const matchingEntry = JSON.parse(data).find(w => w.word === word);
                if (matchingEntry) {
                    resolve(matchingEntry);
                }
                else {
                    console.log("Local lookup failed");
                    reject(new Error(""));
                }
            }
        });
    },
    externalLookUp: function (word, resolve, reject) {
        const options = {
            method: 'GET',
            url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
            headers: {
                'X-RapidAPI-Key': process.env.WORDSAPI_KEY,
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
            }
        };
        axios.request(options).then(function (response) {
            console.log("Requesting");
            let listOfSynonyms = [];
            response.data.results.forEach(element => {
                if (element.synonyms) {
                    element.synonyms.filter(w => !(w.includes(" "))).forEach(w => listOfSynonyms.push(w));
                }
            });
            let numSyllables = 1;
            if (response.data.hasOwnProperty("syllables")) {
                numSyllables = response.data.syllables.count;
            }
            const newEntry = {
                "word": word,
                "syllables": numSyllables,
                "synonyms": listOfSynonyms
            }
            resolve(newEntry);
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });
    },
    addWord: function (newEntry) {
        console.log("Adding new entry to dictionary");
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                let wordList = JSON.parse(data);
                wordList.push(newEntry);
                fs.writeFile(FILE_NAME, JSON.stringify(wordList), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });

    }
}



module.exports = wordRepo;