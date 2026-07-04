import axiosInstance from '../api/api';

export const checkout = async (shippingId) => {
  const response = await axiosInstance.post('/orders/checkout', { shippingId });
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get('/orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};

export const getAdminOrders = async ({ status, page = 0, size = 20 } = {}) => {
  const response = await axiosInstance.get('/admin/orders', { params: { status, page, size } });
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};
