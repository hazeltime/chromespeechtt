// web_speech_api_content.js

// Extract the inner HTML of the language and dialect dropdowns
const languageDropdownHTML = document.querySelector('select#select_language').outerHTML;
const dialectDropdownHTML = document.querySelector('select#select_dialect').outerHTML;

// Send the extracted HTML to the extension's background script
chrome.runtime.sendMessage({
    action: 'sendDropdowns',
    languageDropdownHTML,
    dialectDropdownHTML
});
