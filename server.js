const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "public")));

const guestbook = [];

app.get("/guestbook", (req, res) => {
    res.json(guestbook);
});

app.post("/guestbook", (req, res) => {

    const { name, message } = req.body;

    guestbook.push({
        name,
        message,
        date: new Date().toLocaleString()
    });

    res.json({ success: true });

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});


const fs = require("fs");

const counterFile = path.join(__dirname, "visitorCount.json");

app.get("/api/visitors", (req, res) => {

    const data = JSON.parse(fs.readFileSync(counterFile));

    data.count += 1;

    fs.writeFileSync(counterFile, JSON.stringify(data, null, 2));

    res.json({ count: data.count });

});