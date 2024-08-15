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

// Hämta användarens språkval från lagring och initiera röstigenkänning
chrome.storage.sync.get(['selectedLanguage'], function (result) {
    const language = result.selectedLanguage || 'en-US'; // Default till engelska om inget valts
    initSpeechRecognition(language);
});

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

chrome.storage.sync.get(['selectedLanguage'], function (result) {
    const language = result.selectedLanguage || 'en-US';
    console.log('Initializing speech recognition with language:', language);
    initSpeechRecognition(language);
});
