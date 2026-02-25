import axios from "axios";

export const getProfile = (email) =>
  axios.get(`http://localhost:5000/api/profile/${email}`);

export const updateProfile = (formData) =>
  axios.post(`http://localhost:5000/api/profile/update`, formData);