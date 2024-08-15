// background.js

let dropdownData = {};

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendDropdowns') {
        // Store the dropdown HTML data sent from the content script
        dropdownData.languageDropdownHTML = message.languageDropdownHTML;
        dropdownData.dialectDropdownHTML = message.dialectDropdownHTML;
        console.log("Dropdown data received and stored:", dropdownData);

        // Acknowledge receipt
        sendResponse({ status: "success", message: "Dropdowns received and stored" });
    }

    if (message.action === 'getDropdowns') {
        // Send the stored dropdown HTML data to the popup script
        sendResponse(dropdownData);
        console.log("Dropdown data sent to popup:", dropdownData);
    }
});

// Logging when the background script is loaded
console.log("Background script loaded and waiting for messages.");
