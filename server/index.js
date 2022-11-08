const express = require("express");
const app = express();


require("dotenv").config();
const axios = require("axios");

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


app.listen(5001);