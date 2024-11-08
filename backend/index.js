const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let fakeDatabase = {
    users: [
        { username: "elabr", comments: [] },
        { username: "marko2", comments: [] },
        { username: "ivana", comments: [] }
    ]
};

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


app.post('/api/comments', (req, res) => {
    const { username, comment, enableXSS } = req.body;

    const user = fakeDatabase.users.find(u => u.username === username)

    if (!user){
        return res.status(404).json({message :"Korisnik s tim korisničkim imenom ne postoji!"})
    }

    if (enableXSS === true) {
        //samo spremi kako je predano
        user.comments.push(comment);
        res.status(200).send({ message: "Podaci su pohranjeni bez provjere (XSS omogućen).", data: { username, comment } });
    } 
    else {
        // Ako XSS nije moguc, sanitiziraj komentar
        const sanitizedComment = sanitize(comment);
        user.comments.push(sanitizedComment);
        console.log(sanitizedComment);
        res.status(200).send({ message: "Komentar je sanitiziran i pohranjen (XSS onemogućen)", data: { username, comment: sanitizedComment } });
    }
});

app.get('/api/comments', (req, res) => {
    res.status(200).json(comments);
});

// pokretanje 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
