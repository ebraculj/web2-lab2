const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//baza za xss
let fakeDatabase = {
    users: [
        { username: "elabr", comments: [] },
        { username: "marko2", comments: [] },
        { username: "ivana", comments: [] }
    ]
};

//baza za sde
let userDatabase = {
    users: [
        { username: "elabr", password: "hajduk1911" }, 
        {username: "marko2", password: "lozinka"}
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

/*aj ispocetka cemo...ovo mi je index.html koji je odgovoran za taj sensitive data exposure:
 <form id="sensitiveData">
            <label>Korisničko ime: </label>
            <input type="text" id="usernameIn" placeholder="Unesite korisničko ime" required>
            <br><br>
            <label>Lozinka: </label>
            <input type="password" id="passIn" placeholder="Unesite lozinku" required>
            <button type="submit">Pošalji</button>
        </form>
        <br>
        <label>
            <input type="checkbox" id="sdeTrue"> Omogući nesigurnu pohranu osjetljivih podataka
        </label><br><br>
        <div id="sdeOut"></div>

i sad bi ja laznu pazu podataka s pohranjenin usernameon i onda se pri unosu podataka pregledava jel taj username u toj bazi...ako nije napisi u innerhtml da taj korisnik ne postoji, a ako postoji u toj laznoj bazi onda ako je checkbox oznacen pohrani lozinku kao obicni tekst i u innnehtml napisi da je spremljena lozinka bez hashiranja i zastite i ispisi korisnicko ime i lozinku, a ako je iskljucen checkbix onda hashiraj lozinku i spremi je tako i ispsi da je spremljena sa zastitiom i napisi koako je psremljena*/ 