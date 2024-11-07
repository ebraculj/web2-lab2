 // XSS
 const enableXSSCheckbox = document.getElementById('XSSTrue');
 const xssForm = document.getElementById('xss');
 const xssInput = document.getElementById('xssInput');
 const xssOutput = document.getElementById('xssOutput');
 const usernameInput = document.getElementById("usernameInput");

 xssForm.addEventListener('submit', (e) => {
     e.preventDefault();
     const inputValue = xssInput.value;
     //je li napad omogucen
     if (enableXSSCheckbox.checked) {
         // ako je, izvrsi 
         xssOutput.innerHTML = inputValue;  //prikazivanje komentara - moguce izvrsavanje
         const username = usernameInput.value;

         //alert s podacima
         alert("NAPADNUTI STE!\nXSS napad pokrenut!\n" +
               "Korisničko ime: " + username + "\n" + 
               "Komentar: " + inputValue);
     } else {
         //ako nije omogucen sanitiziraj i prikazi
         const sanitizedInput = sanitizeText(inputValue);
         xssOutput.innerText = "XSS napad nije moguć.\n Sanitizirani unos: " + sanitizedInput;
     }
 });

 //sanitizacija - zamjena spec znakova
 function sanitizeText(input) {
     return input.replace(/[&<>"'/]/g, function(match) {
         switch(match) {
             case '&': return '&amp;';
             case '<': return '&lt;';
             case '>': return '&gt;';
             case '"': return '&quot;';
             case "'": return '&#39;';
             case '/': return '&#47;';
             default: return match;
         }
     });
 }

 //lazna baza podataka
let fakeDatabase = {
    users: []
};

//hash sha256
function hashPassword(password) {
    // U pravoj aplikaciji koristit ćemo specijaliziranu biblioteku za hashiranje
    // Ovdje koristimo browser-ovu funkcionalnost za SHA-256
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then(buffer => {
        let hexArray = Array.from(new Uint8Array(buffer));
        let hexString = hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
        return hexString;
    });
}

//dohvacanje stanja checkboxa i podataka koji su uneseni
const enableInsecureStorageDBCheckbox = document.getElementById('sdeTrue');
const userDataForm = document.getElementById('sensitiveData');
const usernameInputDB = document.getElementById('usernameIn');
const passwordInputDB = document.getElementById('passIn');
const dbOutput = document.getElementById('sdeOut');

userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInputDB.value;
    const password = passwordInputDB.value;
    
    //ako je omogucen napad
    if (enableInsecureStorageDBCheckbox.checked) {
        //pohrana samo kao plaintext
        fakeDatabase.users.push({ username: username, password: password });
        alert("PODACI NISU ZAŠTIĆENI!\nPodaci su spremljeni kao plaintext.\n" + 
            "Korisničko ime: " + username + "\n" + 
            "Lozinka: " + password + "\n"
        )
        //dbOutput.innerText = "Podaci pohranjeni u bazu podataka (plaintext)";
    } else {
        // hashiranje i pohrana lozinke
        hashPassword(password).then((hashedPassword) => {
            fakeDatabase.users.push({ username: username, password: hashedPassword });
            dbOutput.innerText = "Podaci pohranjeni u bazu podataka (hashirana lozinka)";
            dbOutput.innerText = "Korisničko ime: " + username + "\nLozinka: " + hashedPassword + "\n"
        });
    }
});
