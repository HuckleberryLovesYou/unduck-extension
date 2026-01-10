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
                
                // Focus
                input.focus();
                
                // Set content simulating rich text paragraph
                input.innerHTML = `<p>${query}</p>`; 
                
                // Trigger input event so framework detects change
                input.dispatchEvent(new Event('input', { bubbles: true }));

                // Only submit if enabled
                if (autoSubmit) {
                    // Attempt to submit
                    const attemptSubmit = () => {
                        const sendButton = document.querySelector('button[aria-label="Send message"]');
                        if (sendButton && sendButton.getAttribute('aria-disabled') !== 'true') {
                            sendButton.click();
                            return true;
                        }
                        return false;
                    };

                    // Try immediately
                    if (!attemptSubmit()) {
                        // If not ready (e.g. disabled), check rapidly for a short time
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
                        
                        // Safety timeout for button observer
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

// Main logic
const query = getUnduckQuery();
if (query) {
    if (location.hostname.includes('gemini.google.com')) {
        handleGemini(query);
    }
}