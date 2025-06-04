import axios from "axios";
import axiosInstance from "../api/api";

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/login', {
      email: email,
      password: password
    });
    return await response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (user) => {
  try{
    const response = await axiosInstance.post('/register', user)
    return await response.data
  }
  catch(error){
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
}

export const contactUser = async (user) => {
  
  try{
    const response = await axiosInstance.post('/contact', user)
    return await response.data
  }
  catch(error){
    console.error('Message sending error:', error.response?.data || error.message);
    throw error;
  }
};
