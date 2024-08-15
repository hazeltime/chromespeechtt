let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = function(event) {
    let transcript = event.results[0][0].transcript;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: function(text) {
                let inputBox = document.querySelector("textarea"); 
                if (inputBox) {
                    inputBox.value = text;
                } else {
                    alert("Input box not found!");
                }
            },
            args: [transcript]
        });
    });
};

chrome.commands.onCommand.addListener((command) => {
    if (command === "start-speech-to-text") {
        recognition.start();
    }
});
