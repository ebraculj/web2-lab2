// Funkcija za slanje podataka na backend
async function sendDataToBackend(username, comment, enableXSS) {
    const response = await fetch('http://localhost:3000/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            comment: comment,
            enableXSS: enableXSS
        })
    });

    const data = await response.json();
    //console.log("Primljeni podaci ", data);
    return data;
}

console.log("uslo u script.js");

// Dohvati elemente forme i checkbox
const xssForm = document.getElementById("xss");
const xssButton = document.getElementById("XSSTrue");
const xssInput = document.getElementById("xssInput");
const usernameInput = document.getElementById("usernameInput");
const xssOutput = document.getElementById("xssOutput");


// Dodaj submit event listener na formu
xssForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const comment = xssInput.value;
    const enableXSS = xssButton.checked;

    try {
        const result = await sendDataToBackend(username, comment, enableXSS);
        console.log("Komentar s backend-a: ", result.data.comment); // Provjera što dolazi u frontend

        if (enableXSS) {
            console.log("Prije inner: ", result.data.comment);
            //tu se zapravo izvrsava js kod
            xssOutput.innerHTML = `Komentar: ${result.data.comment}`;
            //console.log("Nakon innerHTML ", xssOutput.innerHTML);

        } else {
            // Ako je XSS onemogućen, koristimo innerText da bi se prikazao siguran tekst
            xssOutput.innerText = `Komentar: ${result.data.comment}`;
        }
    } catch (error) {
        console.error("Greška pri slanju podataka na backend: ", error);
    }
});



    /*if (xssButton.checked) {
        if (containsJsCode(inputValue)){
            const result = await sendDataToBackend(username, inputValue, true);
            alert(`XSS napad pokrenut!\nKomentar: ${result.data.comment}\nKorisničko ime: ${result.data.username}`);
        }
        else{
            const result = await sendDataToBackend(username, inputValue, true);
            xssOutput.innerText = `Komentar: ${result.data.comment}`;
        }
        
    } else {
        // Pošaljite podatke s onemogućenim XSS
        const result = await sendDataToBackend(username, inputValue, false);
        xssOutput.innerText = `Komentar: ${result.data.comment}`;*/
    //});
//});

// Lažna baza podataka
let fakeDatabase = {
    users: []
};

// Funkcija za hashiranje lozinke
function hashPassword(password) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then(buffer => {
        let hexArray = Array.from(new Uint8Array(buffer));
        return hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    });
}

// Dohvaćanje stanja checkboxa i podataka koji su uneseni
const enableInsecureStorageDBCheckbox = document.getElementById('sdeTrue');
const userDataForm = document.getElementById('sensitiveData');
const usernameInputDB = document.getElementById('usernameIn');
const passwordInputDB = document.getElementById('passIn');
const dbOutput = document.getElementById('sdeOut');

userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInputDB.value;
    const password = passwordInputDB.value;

    if (enableInsecureStorageDBCheckbox.checked) {
        fakeDatabase.users.push({ username: username, password: password });
        alert("PODACI NISU ZAŠTIĆENI!\nPodaci su spremljeni kao plaintext.\n" + 
            "Korisničko ime: " + username + "\n" + 
            "Lozinka: " + password + "\n"
        );
    } else {
        hashPassword(password).then((hashedPassword) => {
            fakeDatabase.users.push({ username: username, password: hashedPassword });
            dbOutput.innerText = "Podaci pohranjeni u bazu podataka (hashirana lozinka):\n" +
                                 "Korisničko ime: " + username + "\nLozinka: " + hashedPassword + "\n";
        });
    }
});
