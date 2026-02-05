import { getUserId } from "../hooks/useUser";

export const fetchGoogleDriveFiles = async () => {
  try {
    const userId = getUserId();
    if (!userId) return null;

    const baseUrl = import.meta.env.VITE_API_URL;

    // We use a custom fetch wrapper or handle the response check carefully
    const response = await fetch(
      `${baseUrl}/api/auth/google/files?userId=${userId}`,
    );

    // If it's a 404, we know it's not a server crash,
    // it just means "not authorized yet".
    if (response.status === 404) {
      console.log("User not authorized for Google Drive yet.");
      return null;
    }

    // For any other non-200 response, throw an error to be caught by catch()
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const files = await response.json();
    return files;
  } catch (err) {
    // Only log actual network errors or 500 server errors here
    console.error("Failed to sync files:", err);
    return null;
  }
};
