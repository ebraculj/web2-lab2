async function sendDataToBackend(username, comment, enableXSS) {
    const response = await fetch('https://web2-lab2-xynr.onrender.com/api/comments', {
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

async function sendDataToBackendSDE(username, password, enableSDE){

        const response = await fetch(`https://web2-lab2-xynr.onrender.com/api/loginCheck`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password, enableSDE})
        });

        const data = await response.json();
        //console.log(response);
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
        //console.log("poslano: ", {username, comment, enableXSS})
        const result = await sendDataToBackend(username, comment, enableXSS);
        console.log(result);
        if (result.message === "Korisnik s tim korisničkim imenom ne postoji!") {
            xssOutput.innerHTML = `<span style="color: red;">Korisnik ne postoji.</span>`;
            return;
        }
        if (result.data && result.data.comment){
            if (enableXSS) {
            xssOutput.innerHTML = `Komentar uspješno pohranjen!\nPohranjeni komentar: ${result.data.comment}`;
        } 
        else {
            xssOutput.innerText = `Komentar uspješno pohranjen!\nPohranjeni komentar: ${result.data.comment}`;
        }
        }else{
            console.log("Došlo je dogreške pri dohvaćanju podataka");
        }

        
    } catch (error) {
        console.error("Greška pri slanju podataka na backend: ", error);
        xssOutput.innerText = "Došlo je do greške pri slanju podataka.";
    }
});


// Sensitive Data Exposure (SDE) 
const enableSde = document.getElementById('sdeTrue');
const userDataForm = document.getElementById('sensitiveData');
const usernameInputDB = document.getElementById('usernameIn');
const passwordInputDB = document.getElementById('passIn');
const dbOutput = document.getElementById('sdeOut');

userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInputDB.value;
    const password = passwordInputDB.value;
    const enableSDE = enableSde.checked;

    try{
        const response = await sendDataToBackendSDE(username, password, enableSDE);
        console.log(response.message);

        if (response.message == "Korisnik s tim korisničkim imenom ne postoji!"){
            dbOutput.innerHTML = `<span style="color: red;">${response.message}</span>`;
            return;
        }
        else if(response.message == "Lozinka je spremljena kao obični tekst!"){
            dbOutput.innerText = "Lozinka je spremljena kao obični tekst!\nKorisničko ime: " + username + "\nLozinka: " + response.data.password;
            return;
        }
        else if(response.message == "Lozinka je spremljena kao hashirana!"){
            dbOutput.innerText = "Lozinka je spremljena kao hashirana!\nKorisničko ime: " + username + "\nLoznika: " + response.data.hashedPassword;
            return;
        }
        
    }catch(error){
        console.error("Greška pri slanju podataka na backend: ", error);
        dbOutput.innerText = "Došlo je do greške pri slanju podataka.";
    }
})
