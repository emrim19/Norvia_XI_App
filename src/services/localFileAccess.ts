// Define the handler function that calls the Electron bridge
export const getDirectoryContents = async (dirPath: string) => {
  try {
    const result = await window.electronAPI.getDirectoryContents(dirPath);
    return result;
  } catch (error) {
    console.error('Error fetching directory contents:', error);
    throw error;
  }
};

// Define the handler function that opens the folder dialog
export const selectFolder = async () => {
  try {
    const folderPath = await window.electronAPI.selectFolder();
    return folderPath;
  } catch (error) {
    console.error('Error selecting folder:', error);
    throw error;
  }
};