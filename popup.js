// popup.js

document.addEventListener('DOMContentLoaded', function () {
    // Request the dropdown HTML from the background script
    chrome.runtime.sendMessage({ action: 'getDropdowns' }, function (response) {
        if (response && response.languageDropdownHTML && response.dialectDropdownHTML) {
            console.log("Dropdown HTML received in popup:", response);  // Add this line
            document.getElementById('div_language').innerHTML =
                response.languageDropdownHTML + "&nbsp;&nbsp;" + response.dialectDropdownHTML;

            // Reattach the updateCountry event to the language dropdown
            document.getElementById('select_language').addEventListener('change', updateCountry);
        } else {
            console.error("Failed to receive dropdown HTML in popup.");  // Add this line
        }
    });

    // Save the selected language and dialect
    document.getElementById('saveButton').addEventListener('click', function () {
        const selectedLanguage = document.getElementById('select_language').value;
        const selectedDialect = document.getElementById('select_dialect').value;
        chrome.storage.sync.set({ selectedLanguage, selectedDialect }, function () {
            console.log('Language and dialect saved:', selectedLanguage, selectedDialect);
        });
    });
});

// Function to update the dialect dropdown based on the selected language
function updateCountry() {
    const select_language = document.getElementById('select_language');
    const select_dialect = document.getElementById('select_dialect');
    const list = langs[select_language.selectedIndex];
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}
