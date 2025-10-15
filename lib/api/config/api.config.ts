/**
 * Axios API Client Configuration for React Native
 * Configured with secure token storage and proper error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, DEFAULT_HEADERS, TIMEOUT, ERROR_MESSAGES, HTTP_STATUS, AUTH } from '@/constants/index';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT.DEFAULT,
  headers: DEFAULT_HEADERS,
});

// // Debug: Log API requests
// api.interceptors.request.use(
//   (config) => {
//     console.log('🌐 API Request:', {
//       method: config.method?.toUpperCase(),
//       url: config.baseURL + config.url,
//       data: config.data,
//     });
//     return config;
//   },
//   (error) => {
//     console.error('❌ Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Debug: Log API responses
// api.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response:', {
//       status: response.status,
//       url: response.config.url,
//       data: response.data,
//     });
//     return response;
//   },
//   (error) => {
//     console.error('❌ Response Error:', {
//       status: error.response?.status,
//       url: error.config?.url,
//       data: error.response?.data,
//       message: error.message,
//     });
//     return Promise.reject(error);
//   }
// );

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
// api.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     try {
//       const token = await TokenStorage.get();
//       if (token && config.headers) {
//         config.headers.Authorization = `${AUTH.AUTH_HEADER_PREFIX} ${token}`;
//       }
//     } catch (error) {
//       console.error('Error getting token:', error);
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

/**
 * Response Interceptor
 * Handles common response errors
 */
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response.data;
//   },
//   async (error: AxiosError) => {
//     if (error.response) {
//       switch (error.response.status) {
//         case HTTP_STATUS.UNAUTHORIZED:
//           // Clear token and redirect to login
//           try {
//             await TokenStorage.remove();
//             // Use expo-router for navigation in React Native
//             router.replace('/(tabs)');
//           } catch (e) {
//             console.error('Error handling unauthorized:', e);
//           }
//           console.error(ERROR_MESSAGES.ACCESS_FORBIDDEN);
//           break;
        
//         case HTTP_STATUS.FORBIDDEN:
//           console.error(ERROR_MESSAGES.ACCESS_FORBIDDEN);
//           break;
        
//         case HTTP_STATUS.NOT_FOUND:
//           console.error(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
//           break;
        
//         case HTTP_STATUS.SERVER_ERROR:
//           console.error(ERROR_MESSAGES.SERVER_ERROR);
//           break;
        
//         default:
//           console.error(ERROR_MESSAGES.GENERAL_ERROR);
//       }
//     } else if (error.request) {
//       console.error(ERROR_MESSAGES.NETWORK_ERROR);
//     } else {
//       console.error('Error:', error.message);
//     }
    
//     return Promise.reject(error);
//   }
// );

export default api; 