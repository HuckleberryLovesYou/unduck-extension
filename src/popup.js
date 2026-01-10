document.addEventListener('DOMContentLoaded', () => {
    const autoSubmitCheckbox = document.getElementById('autoSubmit');

    // Load saved setting (default to true)
    chrome.storage.local.get(['autoSubmit'], (result) => {
        // If undefined, default to true
        autoSubmitCheckbox.checked = result.autoSubmit !== false;
    });

    // Save on change
    autoSubmitCheckbox.addEventListener('change', (e) => {
        chrome.storage.local.set({ autoSubmit: e.target.checked });
    });
});
