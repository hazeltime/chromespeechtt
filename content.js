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

// Funktion för att ändra språk- och dialekt-dropdown-menyerna på Web Speech API-sidan
function changeLanguage(languageIndex, dialectValue) {
    let languageDropdown = document.querySelector('select#select_language');
    let dialectDropdown = document.querySelector('select#select_dialect');

    if (languageDropdown && dialectDropdown) {
        languageDropdown.selectedIndex = languageIndex;
        languageDropdown.dispatchEvent(new Event('change'));

        dialectDropdown.value = dialectValue;
        dialectDropdown.dispatchEvent(new Event('change'));

        console.log(`Language set to index ${languageIndex}, dialect set to ${dialectValue}.`);
    } else {
        console.error("Language or dialect dropdown not found.");
    }
}

// Funktion för att observera förändringar i DOM och tillämpa språkändringen när elementet är tillgängligt
function observeLanguageDropdown() {
    const observer = new MutationObserver((mutations, observer) => {
        const languageDropdown = document.querySelector('select#select_language');
        const dialectDropdown = document.querySelector('select#select_dialect');

        if (languageDropdown && dialectDropdown) {
            chrome.storage.sync.get(['selectedLanguage'], function (result) {
                let languageCode = result.selectedLanguage || 'sv-SE'; // Default till svenska
                let languageIndex;
                let dialectValue;

                switch (languageCode) {
                    case 'sv-SE':
                        languageIndex = 41; // Svenskans index i språkmenyn
                        dialectValue = 'sv-SE';
                        break;
                    case 'en-US':
                        languageIndex = 10; // Engelska (US)
                        dialectValue = 'en-US';
                        break;
                    case 'en-GB':
                        languageIndex = 10; // Engelska (UK)
                        dialectValue = 'en-GB';
                        break;
                    default:
                        languageIndex = 41;
                        dialectValue = 'sv-SE';
                        break;
                }

                changeLanguage(languageIndex, dialectValue);
                initSpeechRecognition(languageCode);
                observer.disconnect(); // Stoppa observern efter att elementet har hittats och ändringen har gjorts
            });
        }
    });

    // Observera hela dokumentets body för förändringar
    observer.observe(document.body, { childList: true, subtree: true });
}

// Initiera observern när sidan laddas
window.addEventListener('load', observeLanguageDropdown);

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
