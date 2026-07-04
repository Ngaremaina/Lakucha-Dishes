import axiosInstance from '../api/api';

export const getCart = async () => {
  const response = await axiosInstance.get('/cart');
  return response.data; // CartItemResponse[]
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await axiosInstance.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartQuantity = async (id, quantity) => {
  const response = await axiosInstance.patch(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id) => {
  await axiosInstance.delete(`/cart/${id}`);
};
