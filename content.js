// Function to change language and dialect dropdowns on the Web Speech API page
function changeLanguage(languageIndex, dialectValue, attempts = 5) {
    // Find the language and dialect dropdowns
    let languageDropdown = document.querySelector('select#select_language');
    let dialectDropdown = document.querySelector('select#select_dialect');

    if (languageDropdown && dialectDropdown) {
        // Change the language dropdown to the correct language
        languageDropdown.selectedIndex = languageIndex;
        languageDropdown.dispatchEvent(new Event('change'));

        // Change the dialect dropdown to the correct dialect
        dialectDropdown.value = dialectValue;
        dialectDropdown.dispatchEvent(new Event('change'));

        console.log(`Language set to index ${languageIndex}, dialect set to ${dialectValue}.`);
    } else if (attempts > 0) {
        // Retry after a short delay
        console.warn("Language or dialect dropdown not found. Retrying...");
        setTimeout(() => changeLanguage(languageIndex, dialectValue, attempts - 1), 500);
    } else {
        console.error("Language or dialect dropdown not found after several attempts. Skipping language change.");
    }
}

// Wait until the entire page is loaded
window.addEventListener('load', function () {
    // Get the user's selected language from storage and change the dropdowns on the page
    chrome.storage.sync.get(['selectedLanguage'], function (result) {
        let languageCode = result.selectedLanguage || 'en-US';
        let languageIndex;
        let dialectValue;

        // Determine the correct index and dialect based on the selected language
        switch (languageCode) {
            case 'sv-SE':
                languageIndex = 41; // Swedish language index in the dropdown
                dialectValue = 'sv-SE';
                break;
            case 'en-US':
                languageIndex = 10; // English as default
                dialectValue = 'en-US';
                break;
            // Add more languages and dialects if you want to support more options
            default:
                languageIndex = 10;
                dialectValue = 'en-US';
                break;
        }

        // Try to change the language settings on the page
        changeLanguage(languageIndex, dialectValue);

        // Initialize speech recognition with the correct language
        initSpeechRecognition(languageCode);
    });
});

let recognition;
let isRecording = false;

// Function to initialize speech recognition with the correct language
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
