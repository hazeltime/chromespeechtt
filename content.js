let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = function (event) {
    let transcript = event.results[0][0].transcript;
    let inputBox = document.querySelector("textarea");
    if (inputBox) {
        inputBox.value = transcript;
    } else {
        alert("Input box not found!");
    }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start-speech-to-text") {
        recognition.start();
        sendResponse({ status: "started" });
    }
});
