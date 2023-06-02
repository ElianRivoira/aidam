import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const apiForm = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});
