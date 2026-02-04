// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL;

// Optional: check if it's working during development
if (import.meta.env.DEV) {
  console.log("Librarian is talking to:", API_BASE_URL);
}