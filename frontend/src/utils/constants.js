export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
  };
  
  export const CHART_TYPES = {
    LINE: 'line',
    BAR: 'bar',
    PIE: 'pie',
    AREA: 'area',
    SCATTER: 'scatter'
  };
  
  export const FILE_TYPES = {
    CSV: '.csv',
    XLSX: '.xlsx',
    XLS: '.xls',
    SQL: '.sql'
  };
  
  export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 50,
    PAGE_SIZES: [10, 25, 50, 100, 250, 500]
  };
  
  export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';