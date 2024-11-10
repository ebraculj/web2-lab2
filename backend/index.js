#!/usr/bin/env node


const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const db = require('../db');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


function sanitize(comment) {
    return comment
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}


app.post('/api/comments', (req, res) => {
    const { username, comment, enableXSS } = req.body;
    //console.log("primljeni podaci: " + {username, comment, enableXSS});

    // Provjera postoji li korisnik
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            //console.log("greska pri pristupu bazi");
            return res.status(500).json({ message: 'Greška na serveru.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Korisnik s tim korisničkim imenom ne postoji!' });
        }

        
        let finalComment = comment;
        if (enableXSS !== true) {
            finalComment = sanitize(comment);  // Sanitizacija komentara
        }

    
        db.run('UPDATE users SET comment = ? WHERE username = ?', [finalComment, username], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Greška pri spremanju komentara.' });
            }
            res.json({ message: 'Komentar uspješno pohranjen.', data: { username, comment: finalComment } });
        });
    });
});


app.post('/api/loginCheck', (req, res) => {
    const { username, password, enableSDE } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
       
        if (err) {
            return res.status(500).json({ message: 'Greška na serveru.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Korisnik s tim korisničkim imenom ne postoji!' });
        }
        //console.log(res.message);

        if (enableSDE) {
            db.run('UPDATE users SET password = ? WHERE username = ?', [password, username], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Greška pri spremanju lozinke.' });
                }
                return res.json({ message: 'Lozinka je spremljena kao obični tekst!', data: { username, password } });
            });
        } else {
            // Ako omogućimo hashiranu lozinku
            const hashedPassword = hashPassword(password);
            db.run('UPDATE users SET password = ? WHERE username = ?', [hashedPassword, username], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Greška pri spremanju lozinke.' });
                }
                return res.json({ message: 'Lozinka je spremljena kao hashirana!', data: { username, hashedPassword } });
            });
        }
    });
});


app.get('/api/comments', (req, res) => {
    db.all('SELECT username, comment FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Greška pri dohvaćanju komentara.' });
        }
        res.json(rows);
    });
});


app.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
});
