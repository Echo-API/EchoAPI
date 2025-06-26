// Background script for EchoAPI Tester Chrome Extension
// This handles any background tasks and CORS-related functionality

chrome.runtime.onInstalled.addListener(() => {
    console.log('EchoAPI Tester extension installed');
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // The popup will open automatically due to default_popup in manifest
});

// Optional: Handle any cross-origin requests if needed
// Note: Most modern APIs should work directly from the popup with proper CORS headers
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'CORS_REQUEST') {
        // If we need to handle CORS requests through background script
        fetch(request.url, request.options)
            .then(response => response.text())
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        
        return true; // Indicates we will send a response asynchronously
    }
});

// Clean up old storage data on startup
chrome.runtime.onStartup.addListener(async () => {
    try {
        const result = await chrome.storage.local.get(['requestHistory']);
        if (result.requestHistory) {
            // Keep only last 10 requests and clean up old ones
            const cleanHistory = result.requestHistory.slice(0, 10);
            await chrome.storage.local.set({ requestHistory: cleanHistory });
        }
    } catch (error) {
        console.error('Error cleaning up storage:', error);
    }
});