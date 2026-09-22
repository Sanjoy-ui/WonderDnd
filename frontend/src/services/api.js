import axios from 'axios';

// Automatically resolve API URL:
// 1. Environment variable VITE_API_URL (e.g. http://<EC2-IP>:8576/api or /api)
// 2. Fallback to /api (for Vite proxy or CloudFront/ALB reverse proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getListings = async (params = {}) => {
  const response = await apiClient.get('/listings', { params });
  return response.data;
};

export const getListingById = async (id) => {
  const response = await apiClient.get(`/listings/${id}`);
  return response.data;
};

export const createListing = async (listingData) => {
  const response = await apiClient.post('/listings', { listing: listingData });
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await apiClient.put(`/listings/${id}`, { stuffData: listingData });
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await apiClient.delete(`/listings/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
