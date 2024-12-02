export const getToken = () => localStorage.getItem('token');
export const getUserType = () => localStorage.getItem('userType');
export const isLoggedIn = () => !!getToken();
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
};
