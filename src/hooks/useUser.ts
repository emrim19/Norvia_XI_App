export const getStoredUser = () => {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

export const getUserId = () => getStoredUser()?.id;