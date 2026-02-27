import { getUserId } from '../hooks/useUser';

export const fetchGoogleDriveFiles = async () => {
  try {
    const userId = getUserId();
    if (!userId) return null;

    const baseUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(
      `${baseUrl}/api/auth/google/files?userId=${userId}`
    );

    console.log(response);

    if (response.status === 404) {
      console.log('User not authorized for Google Drive yet.');
      return null;
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const files = await response.json();
    return files;
  } catch (err) {
    console.error('Failed to sync files:', err);
    return null;
  }
};
