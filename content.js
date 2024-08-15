// Funktion för att ändra språk- och dialekt-dropdown-menyerna på Web Speech API-sidan
function changeLanguage(languageIndex, dialectValue) {
    // Hitta språkmenyn och dialektmenyn
    let languageDropdown = document.querySelector('select#select_language');
    let dialectDropdown = document.querySelector('select#select_dialect');

    if (languageDropdown && dialectDropdown) {
        // Ändra språkmenyn till rätt språk
        languageDropdown.selectedIndex = languageIndex;
        languageDropdown.dispatchEvent(new Event('change'));

        // Ändra dialektmenyn till rätt dialekt
        dialectDropdown.value = dialectValue;
        dialectDropdown.dispatchEvent(new Event('change'));

        console.log(`Language set to index ${languageIndex}, dialect set to ${dialectValue}.`);
    } else {
        console.error("Language or dialect dropdown not found on the page.");
    }
}

// Vänta tills hela sidan är laddad
window.addEventListener('load', function () {
    // Hämta användarens språkval från lagring och ändra dropdown-menyerna på sidan
    chrome.storage.sync.get(['selectedLanguage'], function (result) {
        let languageCode = result.selectedLanguage || 'en-US';
        let languageIndex;
        let dialectValue;

        // Kolla vilket språk som valts och ställ in rätt index och dialekt
        switch (languageCode) {
            case 'sv-SE':
                languageIndex = 41; // Svenskans index i språkmenyn (baserat på HTML-koden)
                dialectValue = 'sv-SE';
                break;
            case 'en-US':
                languageIndex = 10; // Engelska som standard
                dialectValue = 'en-US';
                break;
            // Lägg till fler språk och dialekter om du vill stödja fler alternativ
            default:
                languageIndex = 10;
                dialectValue = 'en-US';
                break;
        }

        // Ändra språkinställningarna på sidan
        changeLanguage(languageIndex, dialectValue);

        // Initiera röstigenkänning med rätt språk
        initSpeechRecognition(languageCode);
    });
});

let recognition;
let isRecording = false;

// Funktion för att initiera röstigenkänning med rätt språk
function initSpeechRecognition(language) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        let inputBox = document.querySelector("textarea");
        if (inputBox) {
            inputBox.value = transcript;
        } else {
            alert("Input box not found!");
        }
    };

    recognition.onend = function () {
        isRecording = false;
        console.log("Speech recognition stopped.");
    };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "toggle-speech-to-text") {
        if (isRecording) {
            recognition.stop();
            sendResponse({ status: "stopped" });
        } else {
            recognition.start();
            isRecording = true;
            sendResponse({ status: "started" });
        }
    }
});
