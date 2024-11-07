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