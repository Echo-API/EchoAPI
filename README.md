EchoAPI Chrome Extension
Test API endpoints instantly - no signup required

A lightweight Chrome extension that brings the power of EchoAPI directly to your browser. Perfect for developers who need to quickly test REST APIs, debug endpoints, and inspect HTTP responses without leaving their current workflow.

 Features:
Instant API Testing - Test any public API endpoint with a single click
Real HTTP Requests - Makes actual network requests, not mock responses
Complete Response Data - View status codes, headers, response body, and timing
Multiple HTTP Methods - Support for GET, POST, PUT, DELETE, PATCH, and more
Request Customization - Add custom headers and request bodies
Terminal-Style Output - Clean, developer-friendly response display
Copy to Clipboard - Easily copy responses for documentation or debugging
Request History - Access your last 10 API calls
No Signup Required - Start testing immediately

 Installation:
From Chrome Web Store (Recommended)
Visit the EchoAPI Chrome Extension page
Click "Add to Chrome"
Confirm by clicking "Add Extension"
Manual Installation (Developer Mode)
Download the latest release from GitHub Releases
Extract the ZIP file to a folder
Open Chrome and navigate to chrome://extensions/
Enable "Developer mode" in the top right corner
Click "Load unpacked" and select the extracted folder
The EchoAPI extension should now appear in your extensions list

 Usage:
Basic API Testing
Click the EchoAPI extension icon in your Chrome toolbar
Enter an API endpoint URL (e.g., https://jsonplaceholder.typicode.com/users/1)
Select HTTP method (default is GET)
Click "Send Request"
View the complete response including headers, status, and body
Advanced Configuration
Custom Headers: Add authentication tokens, content-type, or other headers
Request Body: Include JSON payloads for POST/PUT requests
Method Selection: Choose from GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
Example Requests
GET Request

URL: https://jsonplaceholder.typicode.com/users/1
Method: GET
POST Request with JSON Body

URL: https://httpbin.org/post
Method: POST
Headers: Content-Type: application/json
Body: {"name": "John Doe", "email": "john@example.com"}
Authenticated Request

URL: https://api.github.com/user
Method: GET
Headers: Authorization: Bearer your_token_here
 Development
Prerequisites
Node.js 16+ (for development tools)
Chrome browser
Basic knowledge of Chrome extension development
Setup

# Clone the repository
git clone https://github.com/your-repo/echoapi-extension.git
cd echoapi-extension

# Install development dependencies (if any)
npm install

# Load extension in Chrome
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select the project folder
File Structure

echoapi-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Styling
├── popup.js              # Main functionality
├── background.js         # Background script (if needed)
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
Building for Production

# Create a ZIP file for Chrome Web Store submission
zip -r echoapi-extension.zip . -x "*.git*" "node_modules/*" "*.md"

 Permissions
The extension requires the following permissions:

activeTab - Access the current tab's URL for context
storage - Save request history and user preferences
host_permissions - Make requests to external APIs
https://*/* - HTTPS endpoints
http://*/* - HTTP endpoints (for development/testing)

  Limitations
CORS Restrictions - Can only test APIs that allow cross-origin requests
Authentication - Limited to header-based auth (no OAuth flows)
File Uploads - Does not support multipart/form-data file uploads
WebSocket - Only supports HTTP/HTTPS, not WebSocket connections

 Troubleshooting
Common Issues
"CORS Error" or "Network Error"

The API doesn't allow cross-origin requests from browser extensions
Try using a CORS proxy or test the API directly in a tool like Postman
"Invalid URL" Error

Ensure the URL includes the protocol (http:// or https://)
Check for typos in the URL
Request Timeout

The API might be slow or unresponsive
Default timeout is 10 seconds
Extension Not Loading

Refresh the extension by going to chrome://extensions/ and clicking the refresh icon
Check the Chrome console for error messages
Getting Help
Check the Issues page
Create a new issue with detailed error information
Include the API endpoint and request details (without sensitive data)

 Contributing
We welcome contributions! Please see our Contributing Guide for details.

Quick Start for Contributors
Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Make your changes
Test thoroughly
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

 Acknowledgments
Inspired by the original EchoAPI web application
Built for the developer community
Thanks to all contributors and users

 Support
Website: echoapi.dev
GitHub Issues: Report a bug
Email: support@echoapi.dev
Made with ❤ for developers who move fast
