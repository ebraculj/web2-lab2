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
    return data;
}

// XSS funkcionalnost
const xssForm = document.getElementById("xss");
const xssButton = document.getElementById("XSSTrue");
const xssInput = document.getElementById("xssInput");
const usernameInput = document.getElementById("usernameInput");
const xssOutput = document.getElementById("xssOutput");

xssForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const comment = xssInput.value;
    const enableXSS = xssButton.checked;

    try {
        const result = await sendDataToBackend(username, comment, enableXSS);
        if (result.message === "Korisnik s tim korisničkim imenom ne postoji!") {
            xssOutput.innerHTML = `<span style="color: red;">Korisnik ne postoji.</span>`;
            return;
        }

        if (enableXSS) {
            // XSS aktivan, izvrši JavaScript kod (potencijalno opasno)
            xssOutput.innerHTML = `Komentar uspješno pohranjen!\nPohranjeni komentar: ${result.data.comment}`;
        } else {
            // XSS nije aktivan, komentari su pohranjeni sigurno
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

// Sensitive Data Exposure (SDE) dio
const enableSde = document.getElementById('sdeTrue');
const userDataForm = document.getElementById('sensitiveData');
const usernameInputDB = document.getElementById('usernameIn');
const passwordInputDB = document.getElementById('passIn');
const dbOutput = document.getElementById('sdeOut');

