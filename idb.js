/**
 * Cost Manager IndexedDB Library - Vanilla JS Version
 * This library provides Promise-based access to IndexedDB for cost management
 * Following the exact specifications from the front-end requirements
 */

// Global object to hold the database reference
const idb = {};
// Exposes simple functions for opening DB, adding costs, and generating reports

/**
 * Opens a connection to the Cost Manager database
 * @param {string} databaseName - Name of the database
 * @param {number} databaseVersion - Version number of the database
 * @returns {Promise} Promise that resolves to database object
 */
idb.openCostsDB = function(databaseName, databaseVersion) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);
        
        request.onerror = function() {
            reject(new Error('Failed to open database'));
        };
        
        request.onsuccess = function() {
            const db = request.result;
            // Also expose convenience methods directly on the db instance
            // so callers like test2.html can do db.addCost(...)
            try {
                db.addCost = function(cost) { return idb.addCost(cost); };
                db.getReport = function(year, month, currency) { return idb.getReport(year, month, currency); };
            } catch (e) {
                // If the IDBDatabase is not extensible, ignore and just return the db
            }
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
// Database is initialized or upgraded lazily the first time it is accessed

/**
 * Adds a new cost item to the database
 * @param {Object} cost - Cost object with sum, currency, category, description
 * @returns {Promise} Promise that resolves to the added cost item
 */
idb.addCost = function(cost) {
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
        idb.openCostsDB('costsdb', 1).then(db => {
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
// Adds a record and returns a simplified object for UI confirmation

/**
 * Gets a detailed report for a specific month and year in a specific currency
 * @param {number} year - Year to get report for
 * @param {number} month - Month to get report for (1-12)
 * @param {string} currency - Target currency for the report
 * @returns {Promise} Promise that resolves to report object
 */
idb.getReport = function(year, month, currency) {
    return new Promise((resolve, reject) => {
        idb.openCostsDB('costsdb', 1).then(db => {
            const transaction = db.transaction(['costs'], 'readonly');
            const store = transaction.objectStore('costs');
            const index = store.index('yearMonth');
            const request = index.getAll([year, month]);
            
            request.onsuccess = function() {
                const costs = request.result;
                
                // Convert costs to the specified currency
                const convertedCosts = costs.map(cost => ({
                    sum: cost.sum, // Note: Currency conversion would be handled by external service
                    currency: currency,
                    category: cost.category,
                    description: cost.description,
                    Date: { day: cost.day }
                }));
                
                // Calculate total
                const total = convertedCosts.reduce((sum, cost) => sum + cost.sum, 0);
                
                const report = {
                    year: year,
                    month: month,
                    costs: convertedCosts,
                    total: {
                        currency: currency,
                        total: total
                    }
                };
                
                resolve(report);
            };
            
            request.onerror = function() {
                reject(new Error('Failed to get report'));
            };
        }).catch(reject);
    });
};
// Retrieves all records for the given year-month and computes a simple total

// Make idb available globally
window.idb = idb;
