const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* DATABASE */

const db = new Database("guestbook.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

/* MIDDLEWARE */

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function sanitize(text) {
return text.replace(/[<>]/g, "");
}

app.get("/guestbook", (req, res) => {

    const messages = db
    .prepare("SELECT name, message, timestamp FROM guestbook ORDER BY id DESC")
    .all();

    res.render("guestbook", { messages });
});

app.post("/api/guestbook", (req, res) => {

    const { name, message } = req.body;

    if(!name || !message) {
        return res.status(400).json({ error: "Name and message are required" });
    }

    const stmt = db.prepare(`
    INSERT INTO guestbook (name, message)
    VALUES (?, ?)
    `);

    stmt.run(
    sanitize(name),
    sanitize(message),
    );

    res.json({ success: true });

});

const counterFile = path.join(__dirname, "visitorCount.json");

app.get("/api/visitors", (req, res) => {

    const data = JSON.parse(fs.readFileSync(counterFile));

    data.count += 1;

    fs.writeFileSync(counterFile, JSON.stringify(data, null, 2));

    res.json({ count: data.count });

});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});



