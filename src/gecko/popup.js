document.addEventListener('DOMContentLoaded', () => {
    const autoSubmitCheckbox = document.getElementById('autoSubmit');

    // Display version
    const version = chrome.runtime.getManifest().version;
    const versionDisplay = document.getElementById('version-display');
    if (versionDisplay) {
        versionDisplay.textContent = `v${version}`;
    }

    // Load saved setting (default to true)
    chrome.storage.local.get(['autoSubmit'], (result) => {
        autoSubmitCheckbox.checked = result.autoSubmit !== false;
    });

    // Save on change
    autoSubmitCheckbox.addEventListener('change', (e) => {
        chrome.storage.local.set({ autoSubmit: e.target.checked });
    });

    const openSearchSettingsButton = document.getElementById('openSearchSettings');
    if (openSearchSettingsButton) {
        openSearchSettingsButton.addEventListener('click', () => {
            chrome.tabs.create({ url: 'instructions.html' });
        });
    }
});