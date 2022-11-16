
const fs = require('fs');
const FILE_NAME = "./assets/wordList.json";
const axios = require("axios");
require('dotenv').config();


const wordRepo = {
    // Get the whole list of words, and return it as an array of objects
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

    // Check the list of words to see if the requested word is there, if not, pass an error to reject()
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
                    reject(new Error("Word not found on list"));
                }
            }
        });
    },
    // Check WordsAPI for the requested word
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
            // Response contains several "results", each with a possible array of synonyms. Loop through and keep only one-word synonyms.
            let listOfSynonyms = [];
            if (response.data.results) {
                console.log(response.data.results);
                response.data.results.forEach(element => {
                    if (element.synonyms) {
                        element.synonyms.filter(w => !(w.includes(" "))).forEach(w => listOfSynonyms.push(w));
                    }
                });
            }
            // Get the number of syllables, assuming it is 1 if there is no response.data.syllables
            let numSyllables = 1;
            if (response.data.hasOwnProperty("syllables")) {
                numSyllables = response.data.syllables.count;
            }
            const newEntry = {
                "word": word,
                "syllables": numSyllables,
                "synonyms": listOfSynonyms
            }
            // pass the retrieved data to resolve function
            resolve(newEntry);
        }).catch(function (error) {
            console.log(error);
            reject(error);
        });
    },
    // Called to add a word that was retieved from WordsAPI to the list for easy access later.
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