chrome.commands.onCommand.addListener((command) => {
    if (command === "start-speech-to-text") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { command: "toggle-speech-to-text" }, function (response) {
                if (chrome.runtime.lastError) {
                    console.error("Could not send message: ", chrome.runtime.lastError.message);
                } else {
                    console.log("Speech recognition toggled:", response.status);
                }
            });
        });
    }
});
