const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Putanja do baze podataka u mapu backend
const dbPath = path.join(__dirname, 'database.db'); // Ovo će automatski odrediti putanju prema 'database.db' u istoj mapi

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Greška pri povezivanju s bazom podataka:', err.message);
    } else {
        console.log('Uspješno povezana SQLite baza podataka.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            comment TEXT
        );
    `, (err) => {
        if (err) {
            console.error("Greška pri stvaranju tablice:", err);
        } else {
            console.log("Tablica 'users' je stvorena ili već postoji.");
        }
    });


    const users = [
        ['elabr', '', null],
        ['marko2', '', null]
    ];

    users.forEach(([username, password, comment]) => {
        db.run(
            'INSERT OR IGNORE INTO users (username, password, comment) VALUES (?, ?, ?)',
            [username, password, comment],
            (err) => {
                if (err) {
                    console.error(`Greška pri dodavanju korisnika ${username}:`, err);
                } else {
                    console.log(`Korisnik ${username} dodan (ako nije postojao).`);
                }
            }
        );
    });
});

module.exports = db;
