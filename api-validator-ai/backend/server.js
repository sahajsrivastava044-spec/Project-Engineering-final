// Import required packages
// express: Web framework to create API server
const express = require("express");
// cors: Allows frontend (hosted on different port) to communicate with backend
const cors = require("cors");
// fetch: Built-in Node.js (v18+) global for making HTTP requests to external APIs
// const fetch = require("node-fetch");
// dotenv: Loads sensitive data (API keys) from .env file into environment variables
require("dotenv").config();

// Create Express application instance
const app = express();

// --- Middleware Configuration ---

// Enable CORS: Allows requests from frontend running on different port
app.use(cors());
// Enable JSON parsing: Converts incoming request body from JSON string to JavaScript object
app.use(express.json());

// --- API Routes ---

// Health check route - simple endpoint to verify server is running
// Used by devops/monitoring tools to check status
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Main AI generation route - receives input and generates validation middleware
// This endpoint bridges the frontend to the AI API
app.post("/generate-validation", async (req, res) => {
  // Extract the user's input from the request body
  const { input } = req.body;

  // Validate that input exists: prevents empty/null requests from going to expensive AI API
  if (!input) {
    return res.status(400).json({ error: "Input required" });
  }

  try {
    // Make HTTP request to OpenRouter API (AI service)
    // OpenRouter acts as a bridge to multiple AI models including GPT-4o-mini
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // API key from .env file - authenticates our request to OpenRouter
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Use GPT-4o-mini: Fast and cost-effective AI model for code generation
        model: "openai/gpt-4o-mini",
        // Messages array: AI APIs use conversation format similar to ChatGPT
        messages: [
          {
            // User role: This is what the user (our app) sends to the AI
            role: "user",
            // System prompt + input: Tells AI what to do and what data to work with
            content: `
You are a senior backend developer.

Generate Express.js validation middleware for the given input.

Requirements:
- Validate required fields
- Check correct data types (string,number,boolean,array)
- Handle empty strings
- Return 400 status with clear error messages
- Keep code clean and readable

Input:
${input}
`
          }
        ]
      })
    });

    const data = await response.json();

    // Check if the HTTP response was successful (status 200-299)
    // If not ok, the API returned an error (e.g., invalid key, rate limit, server error)
    if (!response.ok) {
      return res.status(500).json({
        error: "AI API error",
        details: data
      });
    }

    res.json({
      result: data.choices?.[0]?.message?.content || "No response from AI"
    });

  } catch (err) {
    // Catch any unexpected errors (network failures, timeouts, parsing errors, etc.)
    console.error(err);
    // Return 500 error code: indicates server-side problem
    res.status(500).json({ error: "Server error" });
  }
});

// Read port from environment variable or use default 3000
// This allows deployment flexibility (different servers can use different ports)
const PORT = process.env.PORT || 3000;

// Start the server: app listens for incoming requests on the specified port
// Once started, the server can handle requests from the frontend
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Server initialization complete