const express = require("express");
const app = express();
const PORT = 5001;
const wordRepo = require("./repos/wordRepo.js");

app.get("/", (req, res) => {
    console.log("get request recieved");
    const wordRepo = require('./repos/wordRepo.js');
    wordRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "Word list retrieved.",
            "data": data
        });
    }, function (err) {
        res.status(500).json({
            "status": 500,
            "statusText": "Server error",
            "message": "Failed to retrieve word list.",
            "error": err
        })
    });
});

app.get("/:word", (req, res) => {
    console.log("lookup request recieved.");
    wordRepo.lookUpWord(req.params.word, function (matchingEntry) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "Local lookup successful.",
            "data": matchingEntry
        });
    }, function (err) {
        console.log(err);
        console.log("Checking WordsAPI");
        wordRepo.externalLookUp(req.params.word, function (newEntry) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "WordsAPI lookup successful.",
                "data": newEntry
            });
            wordRepo.addWord(newEntry);
        }, function (err) {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found",
                "message": "Word lookup failed",
                "error": err
            })
        });
    });
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
