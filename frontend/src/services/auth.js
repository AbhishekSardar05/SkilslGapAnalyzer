import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const signup = (data) =>
  axios.post(`${API}/signup`, data);

export const verifyOTP = (email, otp) =>
  axios.post(`${API}/verify-otp`, { email, otp });

export const login = (email, password) =>
  axios.post(`${API}/login`, { email, password });

export const forgotPassword = (email) =>
  axios.post(`${API}/forgot-password`, { email });