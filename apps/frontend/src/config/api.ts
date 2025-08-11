import { config } from './env';

// API Configuration for Financial Modeling Prep
export const buildSearchUrl = (query: string): string => {
  const baseUrl = 'https://financialmodelingprep.com/api/v3/search';
  const params = new URLSearchParams({
    query: query,
    limit: '10',
    exchange: 'NASDAQ',
    apikey: config.FMP_API_KEY,
  });

  return `${baseUrl}?${params.toString()}`;
};

// Backend API endpoints
export const backendEndpoints = {
  portfolio: (user?: string) =>
    user
      ? `${config.BACKEND_URL}/portfolio/${user}`
      : `${config.BACKEND_URL}/portfolio`,

  createPortfolio: () => `${config.BACKEND_URL}/portfolio`,

  updatePortfolio: (user: string) => `${config.BACKEND_URL}/portfolio/${user}`,
};

// Log API configuration in development
if (config.NODE_ENV === 'development') {
  console.log('🔧 API Config:', {
    searchUrl: buildSearchUrl('AAPL'),
    backendUrl: config.BACKEND_URL,
    hasApiKey: config.hasValidApiKey(),
  });
}
