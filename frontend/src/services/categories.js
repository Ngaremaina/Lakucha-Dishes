import axiosInstance from '../api/api';

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const createCategory = async (category) => {
  const response = await axiosInstance.post('/categories', category);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await axiosInstance.put(`/categories/${id}`, category);
  return response.data;
};

export const deleteCategory = async (id) => {
  await axiosInstance.delete(`/categories/${id}`);
};
