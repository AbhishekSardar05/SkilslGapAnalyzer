import axios from "axios";

const API = "http://localhost:5000/api/auth";

/* Signup */
export const signup = (data) =>
  axios.post(`${API}/signup`, data);

/* OTP Verify */
export const verifyOTP = (email, otp) =>
  axios.post(`${API}/verify-otp`, { email, otp });

/* Login with Role */
export const login = (email, password, role) =>
  axios.post(`${API}/login`, { email, password, role });

/* Forgot Password */
export const forgotPassword = (email) =>
  axios.post(`${API}/forgot-password`, { email });