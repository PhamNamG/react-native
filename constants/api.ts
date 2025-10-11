// API URLs - Import from main constants file
import { API_BASE_URL } from './index';

// Re-export for convenience
export { API_BASE_URL };

// API Endpoints
export const API_ENDPOINTS = {
  // Anime endpoints
  ANIME: {
    LATEST: '/category/latest/next',
    POPULAR: '/category/filters',
    BY_SLUG: '/category',
    EPISODE: '/product',
    SEARCH: '/categorys/search',
    CATEGORY: '/categorys',
    CATEGORY_NOMINATED: '/categories/nominated',
    EP2D: '/v1/category/2d',
  },
  // Poster endpoints
  POSTER: {
    BASE: '/poster',
  },
  // Series endpoints
  SERIES: {
    HEADER: '/series/header',
    BY_SLUG: '/series',
    ALL: '/series/active'
  },
  // Category endpoints
  CATEGORY: {
    BASE: '/category',
    PRODUCT: '/product',
    NOMINATED: '/categories/nominated',
    SITEMAP: '/categorys/sitemap',
  },
  TAGS:{
    ALL:'/tags'
  },
  REPORTS: {
    CREATE: '/reports'
  }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// Timeouts
export const TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
} as const; 