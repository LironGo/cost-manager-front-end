/**
 * Currency Service
 * Handles currency conversion using external API
 */

// Default exchange rates URL (can be configured in settings)
const DEFAULT_EXCHANGE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

let exchangeRates = {
  USD: 1,
  GBP: 0.8,
  EURO: 0.85,
  ILS: 3.5
};
// In-memory cache of latest known exchange rates for supported currencies

let exchangeUrl = DEFAULT_EXCHANGE_URL;
// Try to load a previously saved URL from localStorage
try {
  const savedUrl = typeof window !== 'undefined' ? window.localStorage.getItem('exchangeUrl') : null;
  if (savedUrl) {
    exchangeUrl = savedUrl;
  }
} catch (err) {
  // Ignore storage errors and keep default URL
}
// Mutable URL allows configuration from the Settings screen

/**
 * Fetches exchange rates from the configured URL
 * @returns {Promise<Object>} Exchange rates object
 */
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(exchangeUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json();
    
    // Normalize different API shapes into our internal rates
    // Supported inputs:
    // 1) { rates: { USD, GBP, EUR, ILS } }
    // 2) { conversion_rates: { USD, GBP, EUR, ILS } }
    // 3) { conversions: { USD: { USD, GBP, EUR, ILS, ... } } } where values are per 1 USD

    let sourceRates = null;
    if (data && typeof data === 'object') {
      if (data.rates && typeof data.rates === 'object') {
        sourceRates = data.rates;
      } else if (data.conversion_rates && typeof data.conversion_rates === 'object') {
        sourceRates = data.conversion_rates;
      } else if (data.conversions && data.conversions.USD && typeof data.conversions.USD === 'object') {
        // This API provides cross rates keyed by base currency; use USD row
        sourceRates = { ...data.conversions.USD, USD: 1 };
      }
    }

    // Extract rates for supported currencies with sensible fallbacks
    const rates = {
      USD: (sourceRates && (sourceRates.USD ?? 1)) || 1,
      GBP: (sourceRates && (sourceRates.GBP ?? 0.8)) || 0.8,
      EURO: (sourceRates && (sourceRates.EUR ?? 0.85)) || 0.85,
      ILS: (sourceRates && (sourceRates.ILS ?? 3.5)) || 3.5
    };
    
    exchangeRates = rates;
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using defaults:', error);
    return exchangeRates;
  }
};
// Fallback to cached rates ensures the app keeps working offline or on API errors

/**
 * Converts an amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted amount
 */
export const convertAmount = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / exchangeRates[fromCurrency];
  const convertedAmount = usdAmount * exchangeRates[toCurrency];
  
  return convertedAmount;
};
// Two-step conversion avoids needing cross rates and keeps logic simple

/**
 * Converts a report to the specified currency
 * @param {Object} report - Report object with costs array
 * @param {string} targetCurrency - Target currency
 * @returns {Promise<Object>} Converted report
 */
export const convertCurrency = async (report, targetCurrency) => {
  // Ensure we have fresh exchange rates
  await fetchExchangeRates();
  
  const convertedCosts = report.costs.map(cost => ({
    ...cost,
    sum: convertAmount(cost.sum || 0, cost.currency, targetCurrency),
    currency: targetCurrency
  }));
  
  const convertedTotal = convertedCosts.reduce((sum, cost) => sum + cost.sum, 0);
  
  return {
    ...report,
    costs: convertedCosts,
    total: {
      currency: targetCurrency,
      total: convertedTotal
    }
  };
};
// Return value mirrors input shape with normalized currency and recalculated total

/**
 * Sets the exchange rates URL
 * @param {string} url - New exchange rates URL
 */
export const setExchangeUrl = (url) => {
  exchangeUrl = url;
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('exchangeUrl', url);
    }
  } catch (err) {
    // Ignore storage errors
  }
};

/**
 * Gets the current exchange rates URL
 * @returns {string} Current exchange rates URL
 */
export const getExchangeUrl = () => {
  return exchangeUrl;
};

/**
 * Gets current exchange rates
 * @returns {Object} Current exchange rates
 */
export const getExchangeRates = () => {
  return { ...exchangeRates };
};
