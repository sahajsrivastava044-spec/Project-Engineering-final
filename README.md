# Project Objective

This project implements an AI-assisted Express.js validation middleware generator. Its goal is to help developers quickly create input-validation code for REST endpoints by entering the API input schema in natural language.

## File and Code Purpose

- `backend/server.js`: Express.js backend server that receives user input from the frontend, sends it to the OpenRouter AI API (GPT-4o-mini), and returns generated Express validation middleware code.
- `frontend/index.html`: Simple user interface for entering API requirements and showing generated code.
- `frontend/script.js`: Client-side JavaScript that handles button click, input validation, backend request, and result rendering.
- `.gitignore`: Prevents committing generated dependencies (`node_modules`) and local secrets (`.env`) to repository.

## Notes

- No personal or sensitive user data is stored in the repository.
- `OPENROUTER_API_KEY` should remain in `.env` and is excluded from version control.

- Minor update: clarified that this repository contains API Validator AI.