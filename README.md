# API Validator AI

## Problem & Solution

Writing validation code for Express APIs is repetitive and error-prone. Developers often forget to validate:
- Required fields
- Data types (string, number, boolean, array)
- Empty strings
- Field formats

These bugs only appear during testing, wasting time and causing failures.

**API Validator AI** solves this by using AI to instantly generate validation middleware from your API requirements.

---

## How It Works (Simple Explanation)

### The Flow:
```
User enters API requirements → Frontend sends to AI backend → AI generates validation code → Result appears on screen
```

### Step-by-Step:

1. **User Input (Frontend)**
   - User opens `index.html` in a browser
   - They paste their API requirements (e.g., "user: string, required; age: number, 18+; email: string, required")
   - Clicks "Generate Validation" button

2. **Frontend Sends Request**
   - JavaScript (`script.js`) collects the input text
   - Sends a POST request to backend: `http://localhost:3000/generate-validation`
   - Shows "Generating validation..." message while waiting

3. **Backend Processes Request (Express Server)**
   - `server.js` receives the POST request
   - Validates that input is not empty
   - Forwards it to OpenRouter API with GPT-4o-mini AI model
   - Prompts the AI to act as a "senior backend developer" and generate Express validation middleware

4. **AI Generates Code**
   - OpenRouter's AI service receives the prompt
   - Generates Express.js middleware code that validates all the requirements
   - Returns the code as a response

5. **Backend Sends Back Response**
   - Server receives AI's generated code
   - Sends it back to frontend as JSON
   - If there's an error, sends error message

6. **Frontend Displays Result**
   - JavaScript receives the validation code
   - Displays it in the output box with syntax highlighting
   - User can now copy and use the code in their API

---

## Project Structure

```
api-validator-ai/
├── backend/
│   ├── server.js           # Express server, connects to OpenRouter AI
│   ├── package.json        # Node dependencies
│   └── .env                # Store OPENROUTER_API_KEY
├── frontend/
│   ├── index.html          # User interface
│   └── script.js           # Handles input/output and API calls
└── README.md               # This file
```

---

## Development Process & Issues Resolved

### Issue 1: "fetch is not a function" Error
**Problem:** The code initially tried to use `require("node-fetch")`, but this package wasn't properly used or wasn't compatible with the Node.js version.

**Solution:** 
- Removed the `node-fetch` dependency (commented it out)
- Node.js v18+ has built-in `fetch()` API globally available
- The native fetch now works without any external dependency
- This also reduced dependencies and simplified the code

### Issue 2: Missing Dependencies
**Problem:** `package.json` was in the wrong directory, causing npm install to fail initially.

**Solution:**
- Ensured `npm install` ran in the `/backend` directory where `package.json` is located
- Verified all dependencies installed: express, cors, dotenv

### Dependencies Used:
- **express**: Web framework for building the API server
- **cors**: Allows frontend (different port) to communicate with backend
- **dotenv**: Loads environment variables from `.env` file
- Built-in `fetch()`: For calling OpenRouter AI API (no external package needed)

---

## How to Run

### Prerequisites:
- Node.js (v18 or higher - for native fetch support)
- npm
- OpenRouter API key (free tier available at https://openrouter.ai)

### Setup:

1. **Install Dependencies**
   ```bash
   cd api-validator-ai/backend
   npm install
   ```

2. **Create Environment File**
   Create `.env` in the `backend` folder:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   PORT=3000
   ```

3. **Start Backend Server**
   ```bash
   node server.js
   ```
   You should see: `Server running on port 3000`

4. **Open Frontend**
   - Open `api-validator-ai/frontend/index.html` in your browser
   - Or serve it with a simple HTTP server:
     ```bash
     cd api-validator-ai/frontend
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

5. **Use the Tool**
   - Paste API requirements in the textarea
   - Click "Generate Validation"
   - Copy the generated validation code to use in your Express app

---

## Key Files Explained

### `server.js` - The Backend Brain
- **GET `/health`**: Simple health check endpoint
- **POST `/generate-validation`**: Main endpoint that:
  - Receives user input
  - Calls OpenRouter AI API
  - Returns generated validation middleware

### `index.html` - The User Interface
- Simple, clean form with:
  - Textarea for input
  - Generate button
  - Output display area with monospace font for code

### `script.js` - The Connector
- Handles button click
- Sends data to backend
- Displays results or error messages
- Shows "Generating..." loading state

---

## Error Handling

The app handles these cases gracefully:
- **Empty input**: Shows warning message
- **Network error**: Shows "Failed to connect to server"
- **API error**: Shows the error from OpenRouter
- **Server error**: Shows generic error message in console

---

## Summary

This is a lightweight AI-powered tool that combines:
- **Frontend**: Simple HTML/JavaScript interface
- **Backend**: Express server that bridges to AI
- **AI**: OpenRouter's GPT-4o-mini for code generation

The journey from user input to generated validation code takes milliseconds, eliminating the tedious manual process of writing validation middleware.