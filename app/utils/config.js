// Configuration variables for the application

// Gemini API configuration
export const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY"; 

// For development, you can add your API key directly here, but for production
// use environment variables by adding to your .env.local file:
// NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here 