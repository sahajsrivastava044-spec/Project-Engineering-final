// --- Configuration ---

// Backend server address: Frontend sends requests to this URL
// (small change: added this line to satisfy minor update request)
// localhost:3000 is where our Express server runs during development
// After deployment, change this to your production server URL
const BACKEND_URL = "http://localhost:3000";

// Main function: Triggered when user clicks "Generate Validation" button
async function generateValidation() {
  // Get user input from textarea and remove whitespace from both ends
  // .value gets the textarea content, .trim() removes leading/trailing spaces
  const input = document.getElementById("input").value.trim();
  // Get the output div where we will display the generated code
  const output = document.getElementById("output");

  // Validate: Check if user actually typed something
  // Prevents sending empty requests to backend/AI (wastes resources, costs money)
  if (!input) {
    output.innerText = "⚠️ Please enter some input.";
    return;  // Exit function early, don't continue
  }

  // Show loading message: User knows something is happening
  // Makes the app feel responsive (otherwise it looks frozen)
  output.innerText = "⏳ Generating validation...";

  // Try-catch block: Handles two types of errors separately
  // Try: Normal execution path
  // Catch: If anything fails (network error, server down, etc.)
  try {
    // Make HTTP request to backend
    // await: Wait for response before continuing (don't block UI with freeze)
    // POST: Sending data to server
    // /generate-validation: Backend endpoint that calls the AI API
    const response = await fetch(`${BACKEND_URL}/generate-validation`, {
      method: "POST",  // Sending data, not just requesting it
      headers: {
        // Tell backend the body contains JSON (not plain text or form data)
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })  // Convert input to JSON string
    });

    const data = await response.json();

    // Check if the response status is OK (200-299)
    // If !response.ok means status is 400, 500, etc. = an error occurred
    if (!response.ok) {
      // Display the error message from backend to the user
      output.innerText = `❌ Error: ${data.error || "Something went wrong"}`;
      return;  // Stop execution, don't show results
    }

    // Success! Display the AI-generated validation code
    output.innerText = data.result;

  } catch (error) {
    // Catches errors that aren't related to the HTTP response
    // Examples: Network is down, server refused connection, JSON parsing failed, etc.
    output.innerText = "❌ Failed to connect to server.";
  }
  // End of generateValidation() function
}

// Event handler setup complete