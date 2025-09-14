/**
 * Cost Manager IndexedDB Library - React Module Version
 * This library provides Promise-based access to IndexedDB for cost management
 * Compatible with React modules and ES6 imports
 */

import { convertCurrency } from '../services/currencyService';
// Currency conversion utility normalizes stored sums for display/reporting

/**
 * Opens a connection to the Cost Manager database
 * @param {string} databaseName - Name of the database
 * @param {number} databaseVersion - Version number of the database
 * @returns {Promise} Promise that resolves to database object
 */
export const openCostsDB = function(databaseName, databaseVersion) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);
        
        request.onerror = function() {
            reject(new Error('Failed to open database'));
        };
        
        request.onsuccess = function() {
            const db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            // Create object store for costs if it doesn't exist
            if (!db.objectStoreNames.contains('costs')) {
                const costStore = db.createObjectStore('costs', { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                
                // Create indexes for efficient querying
                costStore.createIndex('year', 'year', { unique: false });
                costStore.createIndex('month', 'month', { unique: false });
                costStore.createIndex('yearMonth', ['year', 'month'], { unique: false });
                costStore.createIndex('category', 'category', { unique: false });
            }
        };
    });
};
// Database is created lazily and upgraded with necessary stores/indexes

/**
 * Adds a new cost item to the database
 * @param {Object} cost - Cost object with sum, currency, category, description
 * @returns {Promise} Promise that resolves to the added cost item
 */
export const addCost = function(cost) {
    return new Promise((resolve, reject) => {
        // Validate required properties
        if (!cost.sum || !cost.currency || !cost.category || !cost.description) {
            reject(new Error('Missing required cost properties'));
            return;
        }
        
        // Get current date
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // JavaScript months are 0-based
        const day = now.getDate();
        
        // Create cost item with date
        const costItem = {
            sum: Number(cost.sum),
            currency: String(cost.currency),
            category: String(cost.category).toUpperCase(),
            description: String(cost.description),
            year: year,
            month: month,
            day: day,
            dateAdded: now.toISOString()
        };
        
        // Open database and add cost
        openCostsDB('costsdb', 1).then(db => {
            const transaction = db.transaction(['costs'], 'readwrite');
            const store = transaction.objectStore('costs');
            const request = store.add(costItem);
            
            request.onsuccess = function() {
                // Return the cost item with the generated ID
                const addedCost = {
                    sum: costItem.sum,
                    currency: costItem.currency,
                    category: costItem.category,
                    description: costItem.description,
                    Date: { day: costItem.day }
                };
                resolve(addedCost);
            };
            
            request.onerror = function() {
                reject(new Error('Failed to add cost item'));
            };
        }).catch(reject);
    });
};
// Stored records include normalized fields and computed date breakdown

/**
 * Gets a detailed report for a specific month and year in a specific currency
 * @param {number} year - Year to get report for
 * @param {number} month - Month to get report for (1-12)
 * @param {string} currency - Target currency for the report
 * @returns {Promise} Promise that resolves to report object
 */
export const getReport = async function(year, month, currency) {
    // Open the IndexedDB database and create a read-only transaction
    const db = await openCostsDB('costsdb', 1);
    const transaction = db.transaction(['costs'], 'readonly');
    const store = transaction.objectStore('costs');
    const index = store.index('yearMonth');

    // Query all costs for the specified year and month using composite index
    const costs = await new Promise((resolve, reject) => {
        const request = index.getAll([year, month]);
        request.onsuccess = function() {
            resolve(request.result || []);
        };
        request.onerror = function() {
            reject(new Error('Failed to get report'));
        };
    });

    // Transform raw cost data into a standardized format for reporting
    const preparedCosts = costs.map(cost => ({
        sum: Number(cost.sum) || 0,
        currency: cost.currency,
        category: cost.category,
        description: cost.description,
        Date: { day: cost.day }
    }));

    // Calculate the total sum of all costs in their original currencies
    const total = preparedCosts.reduce((sum, cost) => sum + cost.sum, 0);

    // Create the base report object with year, month, costs, and total
    const report = {
        year: year,
        month: month,
        costs: preparedCosts,
        total: {
            currency: currency,
            total: total
        }
    };

    // Convert all costs and totals to the target currency
    const convertedReport = await convertCurrency(report, currency);
    return convertedReport;
};
// Reports are pulled by composite index and then converted to target currency

// Default export for convenience
export default {
    openCostsDB,
    addCost,
    getReport
};
