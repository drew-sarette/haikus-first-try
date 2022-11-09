const express = require("express");
const app = express();
const PORT = 5001;


require("dotenv").config();
const axios = require("axios");

app.get("/", (req, res) => {
    const wordRepo = require('./repos/wordRepo.js');
    const wordList = wordRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "Word list retrieved.",
            "data": data
        });
    }, function(err) {
        res.status(500).json({
            "status": 500,
            "statusText": "Server error",
            "message": "Failed to retrieve word list.",
            "error": err
        })
    });
});

app.get("/:word", (req, res) => {
    console.log(req.params.word);
    res.sendStatus(200);
});

// const word = "popsicle";
// const options = {
//   method: 'GET',
//   url: `https://wordsapiv1.p.rapidapi.com/words/${word}/syllables`,
//   headers: {
//     'X-RapidAPI-Key': process.env.WORDSAPI_KEY,
//     'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
//   }
// };

// axios.request(options).then(function (response) {
// 	console.log(response.data);
// }).catch(function (error) {
// 	console.error(error);
// });


app.listen(PORT);