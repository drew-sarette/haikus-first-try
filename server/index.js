const express = require("express");
const app = express();
const router = express.Router();

router.get("/", function (req, res, next) {
    res.send("apple");
});

app.use("/api/", router);

const server = app.listen(5000, function() {
    console.log("Node Server is listening on port 5000");
});
