
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
        //console.log("Šaljem podatke:", { username, comment, enableXSS });

        const result = await sendDataToBackend(username, comment, enableXSS);
        //console.log("Komentar s backend-a: ", result.data.comment); 
        if (result.message === "Korisnik s tim korisničkim imenom ne postoji!"){
            xssOutput.innerHTML = `<span style="color: red;">Korisnik ne postoji.</span>`;
            return;
        }

        if (enableXSS) {
            //tu se zapravo izvrsava js kod
            xssOutput.innerHTML = `Komentar uspješno pohranjen!\nPohranjeni komentar: ${result.data.comment}`;

        } else {
            xssOutput.innerText = `Komentar uspješno pohranjen!\nPohranjeni komentar: ${result.data.comment}`;
        }
    } catch (error) {
        console.error("Greška pri slanju podataka na backend: ", error);
        xssOutput.innerText = "Došlo je do greške pri slanju podataka.";
    }
});


// Funkcija za hashiranje lozinke
async function hashPassword(password) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then(buffer => {
        let hexArray = Array.from(new Uint8Array(buffer));
        return hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    });
}

// Dohvaćanje stanja checkboxa i podataka koji su uneseni
const enableSde = document.getElementById('sdeTrue');
const userDataForm = document.getElementById('sensitiveData');
const usernameInputDB = document.getElementById('usernameIn');
const passwordInputDB = document.getElementById('passIn');
const dbOutput = document.getElementById('sdeOut');

userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInputDB.value;
    const password = passwordInputDB.value;
    const endpoint = ""
    if(enableSde.checked){
        endpoint = '/api/loginok';
    }
    else{
        endpoint = '/api/loginnotok';
    }

    if (enableSde.checked){
        console.log("Pohranjena lozinka: " + password);
    }
    else{
        password = await hashPassword(password);
        console.log("Pohranjena lozinka: " + password);
    }

    try{
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'appliaction/json'
            },
            body: JSON.stringify({username, password})

        });
        const data = await response.json();
        dbOutput.innerText = data.message;
    }catch(error){
        console.log("Doslo je do greske pri dohvaćanju podataka s backenda");
        dbOutput.innerText = "Doslo je do greske pri dohvaćanju podataka s backenda";
    }

});
