import axiosInstance from '../api/api';

export const getShippingAddresses = async () => {
  const response = await axiosInstance.get('/shipping');
  return response.data;
};

export const createShipping = async (shipping) => {
  const response = await axiosInstance.post('/shipping', shipping);
  return response.data;
};

export const updateShipping = async (id, shipping) => {
  const response = await axiosInstance.patch(`/shipping/${id}`, shipping);
  return response.data;
};

export const deleteShipping = async (id) => {
  await axiosInstance.delete(`/shipping/${id}`);
};
