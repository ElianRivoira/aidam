import axios from 'axios';

export const api = axios.create({
  baseURL: `http://${process.env.API_ADDRESS}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const apiForm = axios.create({
  baseURL: `http://${process.env.API_ADDRESS}/api`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});
