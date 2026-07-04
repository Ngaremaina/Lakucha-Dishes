import axiosInstance from '../api/api';

export const initiateStkPush = async (orderId, phoneNumber) => {
  const response = await axiosInstance.post('/payments/stk-push', { orderId, phoneNumber });
  return response.data;
};

export const getPaymentForOrder = async (orderId) => {
  const response = await axiosInstance.get(`/payments/order/${orderId}`);
  return response.data;
};
