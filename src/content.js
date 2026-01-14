// Helper to extract query param
function getUnduckQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('unduck');
}

// Gemini specific handler
function handleGemini(query) {    
    chrome.storage.local.get(['autoSubmit'], (result) => {
        const autoSubmit = result.autoSubmit !== false; // Default to true

        const observer = new MutationObserver((mutations, obs) => {
            const input = document.querySelector('div.ql-editor[contenteditable="true"]');

            if (input) {
                obs.disconnect();
                input.focus();
                // Set content simulating rich text paragraph
                input.innerHTML = `<p>${query}</p>`; 
                input.dispatchEvent(new Event('input', { bubbles: true }));

                // Only submit if enabled
                if (autoSubmit) {
                    const attemptSubmit = () => {
                        const sendButton = document.querySelector('button[aria-label="Send message"]');
                        if (sendButton && sendButton.getAttribute('aria-disabled') !== 'true') {
                            sendButton.click();
                            return true;
                        }
                        return false;
                    };

                    if (!attemptSubmit()) {
                        // If not ready (e.g. disabled), check rapidly for 5s
                        const buttonObserver = new MutationObserver(() => {
                            if (attemptSubmit()) {
                                buttonObserver.disconnect();
                                cleanupObserver();
                            }
                        });
                        
                        buttonObserver.observe(document.body, { 
                            childList: true, 
                            subtree: true, 
                            attributes: true, 
                            attributeFilter: ['aria-disabled'] 
                        });
                        
                        // Obserever timeout
                        const cleanupObserver = () => clearTimeout(fallbackTimer);
                        const fallbackTimer = setTimeout(() => buttonObserver.disconnect(), 5000);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Overall timeout
        setTimeout(() => observer.disconnect(), 10000);
    });
}

// Docs specific handler
function handleDocs(query) {
    chrome.storage.local.get(['autoSubmit'], (result) => {
        const autoSubmit = result.autoSubmit !== false; // Default to true

        const waitForSearchBar = setInterval(() => {
            const input = document.querySelector('.search-bar');
            if (input) {
                clearInterval(waitForSearchBar);
                input.focus();
                input.value = query;
                input.dispatchEvent(new Event('input', { bubbles: true }));

                if (autoSubmit) {
                    // Delay for site to finish loading the search results, since pressing enter before doesn't work.
                    setTimeout(() => {
                        input.focus();
                        const enterEvent = {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true
                        };
                        input.dispatchEvent(new KeyboardEvent('keydown', enterEvent));
                        input.dispatchEvent(new KeyboardEvent('keypress', enterEvent));
                        input.dispatchEvent(new KeyboardEvent('keyup', enterEvent));
                    }, 750);
                }
            }
        }, 100);

        // Timeout fallback
        setTimeout(() => clearInterval(waitForSearchBar), 10000);
    });
}

// Copilot specific handler
function handleCopilot(query) {
    chrome.storage.local.get(['autoSubmit'], (result) => {
        const autoSubmit = result.autoSubmit !== false; // Default to true

        const observer = new MutationObserver((mutations, obs) => {
            const input = document.getElementById('userInput');

            if (input) {
                obs.disconnect();
                input.focus();
                input.value = query;
                input.dispatchEvent(new Event('input', { bubbles: true }));

                // Only submit if enabled
                if (autoSubmit) {
                    const attemptSubmit = () => {
                        const sendButton = document.querySelector('button[data-testid="submit-button"]');
                        if (sendButton && !sendButton.disabled && sendButton.getAttribute('aria-disabled') !== 'true') {
                            sendButton.click();
                            return true;
                        }
                        return false;
                    };

                    if (!attemptSubmit()) {
                        const buttonObserver = new MutationObserver(() => {
                            if (attemptSubmit()) {
                                buttonObserver.disconnect();
                                cleanupObserver();
                            }
                        });
                        
                        buttonObserver.observe(document.body, { 
                            childList: true, 
                            subtree: true, 
                            attributes: true, 
                            attributeFilter: ['disabled', 'aria-disabled'] 
                        });
                        
                        const cleanupObserver = () => clearTimeout(fallbackTimer);
                        const fallbackTimer = setTimeout(() => buttonObserver.disconnect(), 5000);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => observer.disconnect(), 10000);
    });
}

// Main logic
const main = () => {
    const query = getUnduckQuery();
    if (query) {
        if (location.hostname.includes('gemini.google.com')) {
            handleGemini(query);
        } else if (location.hostname.includes('docs.timmatheis.com')) {
            handleDocs(query);
        } else if (location.hostname.includes('copilot.microsoft.com')) {
            handleCopilot(query);
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}