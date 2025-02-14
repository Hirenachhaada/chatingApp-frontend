import axios from "axios";

const API_URL = "http://localhost:1337/api/auth/local";

export const login = async (identifier, password) => {
  const response = await axios.post(API_URL, { identifier, password });
  localStorage.setItem("user", JSON.stringify(response.data.jwt));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUserToken = () => {
  return localStorage.getItem("user");
};
