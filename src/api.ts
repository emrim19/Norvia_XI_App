export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (import.meta.env.DEV) {
  console.log("App is talking to:", API_BASE_URL);
}
