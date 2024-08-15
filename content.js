// content.js: Script to manage language and speech recognition settings for ChatGPT

// Function to wait for an element to be available in the DOM
function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const intervalTime = 500;
        let elapsedTime = 0;

        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            } else if (elapsedTime >= timeout) {
                clearInterval(interval);
                reject(new Error(`Element ${selector} not found within timeout`));
            }
            elapsedTime += intervalTime;
        }, intervalTime);
    });
}

// Function to change language and dialect dropdowns on the Web Speech API page
async function changeLanguage(languageIndex, dialectValue) {
    try {
        const languageDropdown = await waitForElement('select#select_language');
        const dialectDropdown = await waitForElement('select#select_dialect');

        console.log("Language dropdown found:", languageDropdown);
        console.log("Dialect dropdown found:", dialectDropdown);

        console.log(`Setting language to index ${languageIndex}`);
        languageDropdown.selectedIndex = languageIndex;
        languageDropdown.dispatchEvent(new Event('change'));

        console.log(`Setting dialect to ${dialectValue}`);
        dialectDropdown.value = dialectValue;
        dialectDropdown.dispatchEvent(new Event('change'));

        console.log(`Language set to index ${languageIndex}, dialect set to ${dialectValue}.`);

        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// Function to initialize speech recognition with the correct language
function initSpeechRecognition(language) {
    console.log(`Initializing speech recognition with language: ${language}`);
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognition result:", transcript);
        const inputBox = document.querySelector("textarea");
        if (inputBox) {
            inputBox.value = transcript;
        } else {
            alert("Input box not found!");
        }
    };

    recognition.onend = function () {
        console.log("Speech recognition stopped.");
    };

    return recognition;
}

// Listener for messages from the extension background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "toggle-speech-to-text") {
        const recognition = initSpeechRecognition(message.language);
        if (recognition) {
            if (recognition.isRecording) {
                console.log("Stopping speech recognition...");
                recognition.stop();
                sendResponse({ status: "stopped" });
            } else {
                console.log("Starting speech recognition...");
                recognition.start();
                recognition.isRecording = true;
                sendResponse({ status: "started" });
            }
        }
    }
});

// Wait until the entire page is loaded and then attempt to set language
window.addEventListener('load', function () {
    console.log("Page loaded. Attempting to set language...");

    chrome.storage.sync.get(['selectedLanguage'], async function (result) {
        const languageCode = result.selectedLanguage || 'en-US';
        let languageIndex;
        let dialectValue;

        switch (languageCode) {
            case 'sv-SE':
                languageIndex = 41; // Swedish language index in the dropdown
                dialectValue = 'sv-SE';
                console.log("Selected language: Swedish");
                break;
            case 'en-US':
                languageIndex = 10; // English as default
                dialectValue = 'en-US';
                console.log("Selected language: English (US)");
                break;
            // Add more languages and dialects if you want to support more options
            default:
                languageIndex = 10;
                dialectValue = 'en-US';
                console.log("Default language: English (US)");
                break;
        }

        const success = await changeLanguage(languageIndex, dialectValue);
        if (success) {
            console.log(`Language successfully changed to ${languageCode}`);
        } else {
            console.log(`Failed to change language to ${languageCode}`);
        }
    });
});
