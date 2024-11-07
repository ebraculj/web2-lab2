const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Poslužite statičke datoteke iz 'public' direktorija
app.use(express.static(path.join(__dirname, 'public')));

// Poslužite index.html kad korisnik posjeti root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Pokrenite server
app.listen(port, () => {
    console.log(`Server je pokrenut na http://localhost:${port}`);
});
