// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth", // <<--- IMPORTANT: points to auth router
  withCredentials: true,
});

export const login = (data: { email: string; password: string }) =>
  api.post("/login", data); // resolves to http://localhost:5000/api/auth/login

export const verifyChallenge = (data: { userId?: string; email?: string; otp: string }) =>
  api.post("/verify-otp", data); // resolves to http://localhost:5000/api/auth/verify-otp

export default api;
