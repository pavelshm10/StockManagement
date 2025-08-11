// Frontend Environment Configuration
export const config = {
  // Financial Modeling Prep API
  FMP_API_KEY:
    import.meta.env.VITE_FMP_API_KEY || 'sd0uxbcjuoaFhulC4OrGZs17vFu19ryl',

  // Backend API URL
  BACKEND_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',

  // Check if we have a valid API key
  hasValidApiKey: () => {
    const key = import.meta.env.VITE_FMP_API_KEY;
    return key && key !== 'sd0uxbcjuoaFhulC4OrGZs17vFu19ryl';
  },
};

// Log configuration in development
if (config.NODE_ENV === 'development') {
  console.log('🔧 Frontend Config:', {
    hasApiKey: config.hasValidApiKey(),
    backendUrl: config.BACKEND_URL,
    environment: config.NODE_ENV,
  });
}
