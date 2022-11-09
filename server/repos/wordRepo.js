const { match } = require('assert');
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
                    console.log("lookup failed");
                    
                    reject(err);
                }
            }
        });
    },
    addWord: function (newEntry, resolve, reject) {
        console.log("new entry added to word list");
    }
}

function externalLookUp(word) {
    console.log("external syllable lookup");
    const options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}/syllables`,
        headers: {
            'X-RapidAPI-Key': process.env.WORDSAPI_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    }
    axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (err) {
        console.log(err);
    });
}

function externalSynonymLookUp(word) {
    console.log("external synonym lookup");
    const options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}/syllables`,
        headers: {
            'X-RapidAPI-Key': process.env.WORDSAPI_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    }
    axios.request(options).then(function (response) {
        return response.data;
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports = wordRepo;