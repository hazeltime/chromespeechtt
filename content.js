let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

let isRecording = false;

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
