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

let exchangeUrl = DEFAULT_EXCHANGE_URL;

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
    
    // Extract rates for supported currencies
    const rates = {
      USD: data.rates.USD || 1,
      GBP: data.rates.GBP || 0.8,
      EURO: data.rates.EUR || 0.85,
      ILS: data.rates.ILS || 3.5
    };
    
    exchangeRates = rates;
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using defaults:', error);
    return exchangeRates;
  }
};

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

/**
 * Sets the exchange rates URL
 * @param {string} url - New exchange rates URL
 */
export const setExchangeUrl = (url) => {
  exchangeUrl = url;
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
