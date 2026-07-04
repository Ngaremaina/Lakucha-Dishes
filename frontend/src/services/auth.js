import axiosInstance from '../api/api';

export const registerUser = async ({ username, email, password }) => {
  const response = await axiosInstance.post('/auth/register', { username, email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const refreshSession = async () => {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data;
};

export const logoutUser = async () => {
  await axiosInstance.post('/auth/logout');
};
