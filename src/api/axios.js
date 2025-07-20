import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:2000/api",
  baseURL: "https://drive-backendd.vercel.app/api",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
