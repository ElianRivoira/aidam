import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const apiForm = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

export const apiFile = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/pdf',
  },
  withCredentials: true,
});

export const apiImg = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'image/png',
  },
  withCredentials: true,
});
