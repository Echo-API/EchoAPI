class EchoAPITester {
    constructor() {
        this.currentRequest = null;
        this.requestHistory = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.addInitialHeader();
        await this.loadHistory();
        // Initialize with settings content hidden
        this.hideAllSettingsSections();
    }

    setupEventListeners() {
        // Basic controls
        document.getElementById('sendBtn').addEventListener('click', () => this.sendRequest());
        document.getElementById('urlInput').addEventListener('input', () => this.validateUrl());
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendRequest();
        });

        // Settings dropdown - FIXED: Don't blur immediately and debug
        document.getElementById('settingsDropdown').addEventListener('change', (e) => {
            console.log('Settings dropdown changed to:', e.target.value);
            this.showSettingsSection(e.target.value);
        });

        // Method dropdown - FIXED: Don't blur immediately  
        document.getElementById('httpMethod').addEventListener('change', (e) => {
            this.updateBodyTabVisibility(e.target.value);
        });

        // Body type dropdown - FIXED: Don't blur immediately
        document.getElementById('bodyType').addEventListener('change', (e) => {
            this.updateBodyPlaceholder(e.target.value);
        });

        // FIXED: Only close dropdowns when clicking outside them
        document.addEventListener('click', (e) => {
            // Check if click is outside any dropdown
            const isDropdownClick = e.target.closest('select') || 
                                  e.target.closest('.settings-dropdown') || 
                                  e.target.closest('.method-select') ||
                                  e.target.closest('.body-type-selector');
            
            if (!isDropdownClick) {
                // Only blur if clicking completely outside
                document.querySelectorAll('select').forEach(select => {
                    select.blur();
                });
            }
        });

        // FIX: Prevent dropdown styling issues with forced styling
        this.setupDropdownStylingFix();

        // Example buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('example-btn')) {
                const url = e.target.dataset.url;
                document.getElementById('urlInput').value = url;
                this.validateUrl();
                // Reset dropdown
                document.getElementById('settingsDropdown').value = '';
                this.hideAllSettingsSections();
            }
        });

        // Headers
        document.getElementById('addHeader').addEventListener('click', () => this.addHeaderRow());

        // Response controls
        document.getElementById('copyResponse').addEventListener('click', () => this.copyResponse());
        document.getElementById('exportResponse').addEventListener('click', () => this.exportResponse());

        // History
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistory());
        document.getElementById('closeHistory').addEventListener('click', () => this.hideHistory());
        document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());

        // Modal overlay click
        document.getElementById('historyModal').addEventListener('click', (e) => {
            if (e.target.id === 'historyModal') this.hideHistory();
        });
    }

    // NEW METHOD: Force dropdown styling consistency
    setupDropdownStylingFix() {
        const dropdowns = ['settingsDropdown', 'httpMethod', 'bodyType'];
        
        const arrowSvg = "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")";
        
        dropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            
            // Force styling on all events that might change appearance
            const forceStyle = () => {
                dropdown.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important');
                dropdown.style.setProperty('color', '#ffffff', 'important');
                dropdown.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important');
                dropdown.style.setProperty('background-image', arrowSvg, 'important');
                dropdown.style.setProperty('background-repeat', 'no-repeat', 'important');
                dropdown.style.setProperty('background-position', 'right 12px center', 'important');
                dropdown.style.setProperty('background-size', '16px', 'important');
                dropdown.style.setProperty('-webkit-appearance', 'none', 'important');
                dropdown.style.setProperty('-moz-appearance', 'none', 'important');
                dropdown.style.setProperty('appearance', 'none', 'important');
                dropdown.style.setProperty('padding-right', '40px', 'important');
            };
            
            // Apply forced styling on various events
            dropdown.addEventListener('focus', forceStyle);
            dropdown.addEventListener('blur', forceStyle);
            dropdown.addEventListener('change', forceStyle);
            dropdown.addEventListener('mouseenter', forceStyle);
            dropdown.addEventListener('mouseleave', forceStyle);
            dropdown.addEventListener('click', forceStyle);
            
            // Also force style other dropdowns when this one is interacted with
            dropdown.addEventListener('focus', () => {
                dropdowns.forEach(otherId => {
                    if (otherId !== dropdownId) {
                        const other = document.getElementById(otherId);
                        if (other) {
                            other.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important');
                            other.style.setProperty('color', '#ffffff', 'important');
                            other.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important');
                            other.style.setProperty('background-image', arrowSvg, 'important');
                            other.style.setProperty('background-repeat', 'no-repeat', 'important');
                            other.style.setProperty('background-position', 'right 12px center', 'important');
                            other.style.setProperty('background-size', '16px', 'important');
                        }
                    }
                });
            });
            
            // Initial styling
            forceStyle();
        });
        
        // Also set up a more frequent check to maintain styling
        setInterval(() => {
            dropdowns.forEach(dropdownId => {
                const dropdown = document.getElementById(dropdownId);
                if (dropdown) {
                    dropdown.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important');
                    dropdown.style.setProperty('color', '#ffffff', 'important');
                    dropdown.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.1)', 'important');
                    dropdown.style.setProperty('background-image', arrowSvg, 'important');
                    dropdown.style.setProperty('background-repeat', 'no-repeat', 'important');
                    dropdown.style.setProperty('background-position', 'right 12px center', 'important');
                    dropdown.style.setProperty('background-size', '16px', 'important');
                    dropdown.style.setProperty('-webkit-appearance', 'none', 'important');
                    dropdown.style.setProperty('-moz-appearance', 'none', 'important');
                    dropdown.style.setProperty('appearance', 'none', 'important');
                    dropdown.style.setProperty('padding-right', '40px', 'important');
                }
            });
        }, 50); // More frequent checks
    }

    showSettingsSection(sectionName) {
        console.log('showSettingsSection called with:', sectionName);
        
        // First hide all sections
        this.hideAllSettingsSections();
        
        if (sectionName && sectionName !== '') {
            // Show the settings content container
            const settingsContent = document.getElementById('settingsContent');
            console.log('settingsContent element:', settingsContent);
            
            if (settingsContent) {
                settingsContent.classList.remove('hidden');
                settingsContent.style.display = 'block'; // Force display
                console.log('Settings content shown');
            }
            
            // Show the specific section
            const section = document.getElementById(`${sectionName}-section`);
            console.log(`Looking for section: ${sectionName}-section`, section);
            
            if (section) {
                section.classList.remove('hidden');
                section.style.display = 'block'; // Force display
                console.log(`Section ${sectionName} shown`);
            } else {
                console.error(`Section ${sectionName}-section not found!`);
            }
        }
    }

    hideAllSettingsSections() {
        // Hide the main settings content
        const settingsContent = document.getElementById('settingsContent');
        if (settingsContent) {
            settingsContent.classList.add('hidden');
            settingsContent.style.display = 'none';
        }
        
        // Hide all individual sections
        const sections = ['headers-section', 'body-section', 'options-section', 'examples-section'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('hidden');
                section.style.display = 'none';
            }
        });
    }

    addInitialHeader() {
        // Start with minimal headers
        this.addHeaderRow('Accept', 'application/json, text/plain, */*');
    }

    addHeaderRow(key = '', value = '') {
        const container = document.querySelector('.headers-container');
        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        
        headerRow.innerHTML = `
            <input type="text" placeholder="Header name" class="header-key" value="${key}">
            <input type="text" placeholder="Header value" class="header-value" value="${value}">
            <button class="remove-header">×</button>
        `;
        
        // Add remove functionality
        headerRow.querySelector('.remove-header').addEventListener('click', () => {
            headerRow.remove();
        });
        
        container.appendChild(headerRow);
    }

    updateBodyTabVisibility(method) {
        const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
        const bodySection = document.getElementById('body-section');
        
        if (!hasBody && bodySection && !bodySection.classList.contains('hidden')) {
            // If body section is currently visible and method doesn't support body, hide it
            this.hideAllSettingsSections();
            document.getElementById('settingsDropdown').value = '';
        }
    }

    updateBodyPlaceholder(bodyType) {
        const textarea = document.getElementById('requestBody');
        const placeholders = {
            'json': '{\n  "key": "value"\n}',
            'form': 'key1=value1&key2=value2',
            'text': 'Raw text content...',
            'xml': '<?xml version="1.0"?>\n<root>\n  <item>value</item>\n</root>',
            'none': ''
        };
        
        textarea.placeholder = placeholders[bodyType] || '';
        
        if (bodyType === 'none') {
            textarea.disabled = true;
            textarea.value = '';
        } else {
            textarea.disabled = false;
        }
    }

    validateUrl() {
        const urlInput = document.getElementById('urlInput');
        const validation = document.getElementById('urlValidation');
        const url = urlInput.value.trim();
        
        if (!url) {
            urlInput.classList.remove('invalid');
            validation.textContent = '';
            return true;
        }
        
        try {
            new URL(url);
            urlInput.classList.remove('invalid');
            validation.textContent = '';
            return true;
        } catch {
            urlInput.classList.add('invalid');
            validation.textContent = 'Please enter a valid URL';
            return false;
        }
    }

    async sendRequest() {
        if (!this.validateUrl()) return;
        
        const url = document.getElementById('urlInput').value.trim();
        if (!url) return;
        
        const method = document.getElementById('httpMethod').value;
        const timeout = parseInt(document.getElementById('timeout').value) * 1000;
        
        // Prepare request
        const request = {
            url,
            method,
            headers: this.getHeaders(),
            body: this.getRequestBody(),
            timestamp: new Date().toISOString()
        };
        
        // Show loading
        this.showLoading();
        
        try {
            const startTime = performance.now();
            
            // Create minimal fetch options for better compatibility
            const fetchOptions = {
                method,
                signal: AbortSignal.timeout(timeout)
            };
            
            // Only add headers if they exist and are not empty
            const headers = {};
            Object.entries(request.headers).forEach(([key, value]) => {
                if (key && value && key.trim() && value.trim()) {
                    headers[key.trim()] = value.trim();
                }
            });
            
            // Add minimal required headers only
            if (Object.keys(headers).length > 0) {
                fetchOptions.headers = headers;
            }
            
            // Add body for methods that support it
            if (['POST', 'PUT', 'PATCH'].includes(method) && request.body) {
                fetchOptions.body = request.body;
                // Ensure content-type for body requests
                if (!fetchOptions.headers) fetchOptions.headers = {};
                if (!fetchOptions.headers['Content-Type'] && !fetchOptions.headers['content-type']) {
                    fetchOptions.headers['Content-Type'] = 'application/json';
                }
            }
            
            console.log('Making request with options:', fetchOptions);
            
            // Make the request
            const response = await fetch(url, fetchOptions);
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            console.log('Response received:', response.status, response.statusText);
            
            // Get response data
            const responseText = await response.text();
            let responseData;
            let contentType = response.headers.get('content-type') || '';
            
            try {
                if (contentType.includes('application/json') || responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
                    responseData = JSON.parse(responseText);
                } else {
                    responseData = responseText;
                }
            } catch {
                responseData = responseText;
            }
            
            // Calculate response size
            const responseSize = new Blob([responseText]).size;
            
            // Create response object
            const responseObj = {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: responseData,
                responseTime,
                responseSize,
                url: response.url,
                requestHeaders: fetchOptions.headers || {}
            };
            
            this.displayResponseWithTyping(responseObj);
            this.saveToHistory({ ...request, response: responseObj });
            
        } catch (error) {
            console.error('Request failed:', error);
            this.displayError(error);
        } finally {
            this.hideLoading();
        }
    }

    getHeaders() {
        const headers = {};
        const headerRows = document.querySelectorAll('.header-row');
        
        headerRows.forEach(row => {
            const key = row.querySelector('.header-key').value.trim();
            const value = row.querySelector('.header-value').value.trim();
            
            if (key && value) {
                headers[key] = value;
            }
        });
        
        return headers;
    }

    getRequestBody() {
        const bodyType = document.getElementById('bodyType').value;
        const bodyContent = document.getElementById('requestBody').value.trim();
        
        if (bodyType === 'none' || !bodyContent) {
            return null;
        }
        
        return bodyContent;
    }

    showLoading() {
        const responseSection = document.querySelector('.response-section');
        
        document.getElementById('loadingIndicator').classList.remove('hidden');
        document.getElementById('responseStatus').classList.add('hidden');
        document.getElementById('responseDisplay').innerHTML = '';
        document.getElementById('sendBtn').disabled = true;
        
        // Remove status-visible class to make response bubble bigger
        responseSection.classList.remove('status-visible');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
        document.getElementById('sendBtn').disabled = false;
    }

    displayResponseWithTyping(response) {
        // Show status first and add class to shrink response section
        const statusEl = document.getElementById('responseStatus');
        const responseSection = document.querySelector('.response-section');
        
        const statusCode = statusEl.querySelector('.status-code');
        const statusText = statusEl.querySelector('.status-text');
        const responseTime = statusEl.querySelector('.response-time');
        const responseSize = statusEl.querySelector('.response-size');
        
        statusCode.textContent = response.status;
        statusText.textContent = response.statusText;
        responseTime.textContent = `${response.responseTime}ms`;
        responseSize.textContent = this.formatBytes(response.responseSize);
        
        // Set status color
        statusCode.classList.remove('success', 'redirect', 'error');
        if (response.status >= 200 && response.status < 300) {
            statusCode.classList.add('success');
        } else if (response.status >= 300 && response.status < 400) {
            statusCode.classList.add('redirect');
        } else {
            statusCode.classList.add('error');
        }
        
        // Show status and shrink response section
        statusEl.classList.remove('hidden');
        responseSection.classList.add('status-visible');
        
        // Display response content with typing effect
        const display = document.getElementById('responseDisplay');
        const content = this.formatResponseContent(response);
        
        // Create container for typing effect
        const container = document.createElement('div');
        container.className = 'response-content';
        
        const pre = document.createElement('pre');
        pre.innerHTML = content;
        pre.style.color = '#00ff88';
        
        container.appendChild(pre);
        display.innerHTML = '';
        display.appendChild(container);
        
        // Add typing effect with smart scrolling
        this.animateTypingWithSmartScroll(pre, content, display);
        
        this.currentRequest = response;
    }
    
    animateTypingWithSmartScroll(element, fullContent, scrollContainer) {
        element.innerHTML = '';
        element.style.borderRight = '2px solid #00ff88';
        
        let index = 0;
        const speed = 15;
        let autoScroll = true;
        let userScrolling = false;
        
        // Function to check if user is at the bottom
        const isAtBottom = () => {
            const threshold = 5;
            return scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold;
        };
        
        // Listen for user scroll events
        const handleScroll = () => {
            if (userScrolling) return;
            
            if (isAtBottom()) {
                autoScroll = true;
            } else {
                autoScroll = false;
            }
        };
        
        // Listen for manual scroll wheel/touch events
        const handleUserScroll = () => {
            userScrolling = false;
            handleScroll();
        };
        
        scrollContainer.addEventListener('scroll', handleScroll);
        scrollContainer.addEventListener('wheel', handleUserScroll);
        scrollContainer.addEventListener('touchmove', handleUserScroll);
        
        const typeWriter = () => {
            if (index < fullContent.length) {
                // Handle HTML tags properly
                if (fullContent.charAt(index) === '<') {
                    const tagEnd = fullContent.indexOf('>', index);
                    if (tagEnd !== -1) {
                        element.innerHTML += fullContent.substring(index, tagEnd + 1);
                        index = tagEnd + 1;
                    } else {
                        element.innerHTML += fullContent.charAt(index);
                        index++;
                    }
                } else {
                    element.innerHTML += fullContent.charAt(index);
                    index++;
                }
                
                // Auto-scroll only if enabled
                if (autoScroll) {
                    userScrolling = true;
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                    setTimeout(() => { userScrolling = false; }, 10);
                }
                
                setTimeout(typeWriter, speed);
            } else {
                // Typing complete
                element.style.borderRight = 'none';
                element.style.whiteSpace = 'pre-wrap';
                
                // Remove event listeners
                scrollContainer.removeEventListener('scroll', handleScroll);
                scrollContainer.removeEventListener('wheel', handleUserScroll);
                scrollContainer.removeEventListener('touchmove', handleUserScroll);
                
                // Final scroll to bottom if auto-scroll is enabled
                if (autoScroll) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
            }
        };
        
        typeWriter();
    }

    displayError(error) {
        const display = document.getElementById('responseDisplay');
        let errorMessage = '';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error - This API doesn\'t allow requests from browser extensions';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error - Check your internet connection';
        } else {
            errorMessage = error.message;
        }
        
        display.innerHTML = `
            <div class="response-content">
                <pre style="color: var(--error-color);">Error: ${errorMessage}</pre>
            </div>
        `;
    }

    formatResponseContent(response) {
        let content = `HTTP/${response.status} ${response.statusText}\n`;
        content += `Response Time: ${response.responseTime}ms\n`;
        content += `Content Length: ${this.formatBytes(response.responseSize)}\n`;
        content += `URL: ${response.url}\n\n`;
        
        // Show request headers that were sent
        if (response.requestHeaders && Object.keys(response.requestHeaders).length > 0) {
            content += 'Request Headers Sent:\n';
            Object.entries(response.requestHeaders).forEach(([key, value]) => {
                content += `${key}: ${value}\n`;
            });
            content += '\n';
        }
        
        // Response Headers
        content += 'Response Headers:\n';
        Object.entries(response.headers).forEach(([key, value]) => {
            // Break long header values to prevent horizontal overflow
            if (value.length > 50) {
                const chunks = value.match(/.{1,50}/g) || [value];
                content += `${key}: ${chunks.join('\n    ')}\n`;
            } else {
                content += `${key}: ${value}\n`;
            }
        });
        
        content += '\nResponse Body:\n';
        
        if (typeof response.data === 'object') {
            // Format JSON with proper indentation and line breaks
            const jsonString = JSON.stringify(response.data, null, 2);
            content += this.syntaxHighlightJSON(jsonString);
        } else {
            // For text responses, ensure proper wrapping
            const textData = response.data.toString();
            if (textData.length > 80) {
                // Break long lines
                const wrappedText = textData.replace(/(.{80})/g, '$1\n');
                content += this.escapeHtml(wrappedText);
            } else {
                content += this.escapeHtml(textData);
            }
        }
        
        return content;
    }

    syntaxHighlightJSON(json) {
        return json
            .replace(/("([^"\\]|\\.)*")\s*:/g, '<span class="json-key">$1</span>:')
            .replace(/:\s*("([^"\\]|\\.)*")/g, ': <span class="json-string">$1</span>')
            .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
            .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
            .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async copyResponse() {
        if (!this.currentRequest) return;
        
        const content = this.formatResponseContent(this.currentRequest);
        const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        
        try {
            await navigator.clipboard.writeText(textContent);
            this.showToast('Response copied to clipboard');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    exportResponse() {
        if (!this.currentRequest) return;
        
        const dataStr = JSON.stringify(this.currentRequest, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `api-response-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Response exported');
    }

    showToast(message) {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: var(--bg-primary);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    async saveToHistory(request) {
        try {
            const result = await chrome.storage.local.get(['requestHistory']);
            let history = result.requestHistory || [];
            
            // Add new request to beginning
            history.unshift(request);
            
            // Keep only last 10 requests
            history = history.slice(0, 10);
            
            await chrome.storage.local.set({ requestHistory: history });
            this.requestHistory = history;
        } catch (error) {
            console.error('Failed to save history:', error);
        }
    }

    async loadHistory() {
        try {
            const result = await chrome.storage.local.get(['requestHistory']);
            this.requestHistory = result.requestHistory || [];
        } catch (error) {
            console.error('Failed to load history:', error);
            this.requestHistory = [];
        }
    }

    showHistory() {
        const modal = document.getElementById('historyModal');
        const historyList = document.getElementById('historyList');
        
        if (this.requestHistory.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No requests in history</p>';
        } else {
            historyList.innerHTML = this.requestHistory.map((request, index) => `
                <div class="history-item" data-index="${index}">
                    <div class="history-method">${request.method}</div>
                    <div class="history-url">${request.url}</div>
                    <div class="history-time">${new Date(request.timestamp).toLocaleString()}</div>
                </div>
            `).join('');
            
            // Add click handlers
            historyList.querySelectorAll('.history-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    this.loadFromHistory(index);
                    this.hideHistory();
                });
            });
        }
        
        modal.classList.remove('hidden');
    }

    hideHistory() {
        document.getElementById('historyModal').classList.add('hidden');
    }

    loadFromHistory(index) {
        const request = this.requestHistory[index];
        if (!request) return;
        
        // Load basic request data
        document.getElementById('urlInput').value = request.url;
        document.getElementById('httpMethod').value = request.method;
        
        // Clear existing headers
        document.querySelectorAll('.header-row').forEach(row => row.remove());
        
        // Load headers
        Object.entries(request.headers).forEach(([key, value]) => {
            this.addHeaderRow(key, value);
        });
        
        // Load body
        if (request.body) {
            document.getElementById('requestBody').value = request.body;
            // Try to detect body type
            try {
                JSON.parse(request.body);
                document.getElementById('bodyType').value = 'json';
            } catch {
                document.getElementById('bodyType').value = 'text';
            }
        }
        
        this.validateUrl();
    }

    async clearHistory() {
        try {
            await chrome.storage.local.remove(['requestHistory']);
            this.requestHistory = [];
            this.hideHistory();
            this.showToast('History cleared');
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EchoAPITester();
});
