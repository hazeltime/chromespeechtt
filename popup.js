document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.getElementById('languageSelect');
    const saveButton = document.getElementById('saveButton');

    // Ladda tidigare valt språk
    chrome.storage.sync.get(['selectedLanguage'], function (result) {
        if (result.selectedLanguage) {
            languageSelect.value = result.selectedLanguage;
        }
    });

    // Spara språket när användaren klickar på spara-knappen
    saveButton.addEventListener('click', function () {
        const selectedLanguage = languageSelect.value;
        chrome.storage.sync.set({ selectedLanguage: selectedLanguage }, function () {
            console.log('Language is set to ' + selectedLanguage);
            window.close();
        });
    });
});
