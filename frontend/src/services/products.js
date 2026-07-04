import axiosInstance from '../api/api';

export const getProducts = async ({ page = 0, size = 20 } = {}) => {
  const response = await axiosInstance.get('/products', { params: { page, size } });
  return response.data; // PageResponse<ProductResponse>
};

export const getProduct = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product) => {
  const response = await axiosInstance.post('/products', product);
  return response.data;
};

export const updateProduct = async (id, product) => {
  const response = await axiosInstance.put(`/products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id) => {
  await axiosInstance.delete(`/products/${id}`);
};
