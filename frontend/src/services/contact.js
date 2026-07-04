import axiosInstance from '../api/api';

export const sendContactMessage = async ({ name, email, message }) => {
  const response = await axiosInstance.post('/contact', { name, email, message });
  return response.data;
};

export const getContactMessages = async ({ page = 0, size = 20 } = {}) => {
  const response = await axiosInstance.get('/contact', { params: { page, size } });
  return response.data;
};

export const deleteContactMessage = async (id) => {
  await axiosInstance.delete(`/contact/${id}`);
};
