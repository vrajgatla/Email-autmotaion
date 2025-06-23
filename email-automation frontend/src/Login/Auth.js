export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
};
