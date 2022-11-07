require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();

router.get("/", function (req, res, next) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.WORDSAPI_KEY,
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };
    
    fetch('https://wordsapiv1.p.rapidapi.com/words/.22-caliber/pertainsTo', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    res.send("apple");
});

app.use("/api/", router);

const server = app.listen(5000, function() {
    console.log("Node Server is listening on port 5000");
});
