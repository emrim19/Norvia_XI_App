export const fetchLocalFiles = async () => {
  try {
    const result = await window.electronAPI.selectFolder();
    if (result) {
      return result;
    }
  } catch (error) {
    console.error("Scan error:", error);
  }
};
