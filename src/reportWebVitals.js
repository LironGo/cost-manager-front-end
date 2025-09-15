// Report Core Web Vitals (and TTFB) to a provided callback
// Pass a function (e.g., analytics logger) to receive metric objects
const reportWebVitals = onPerfEntry => {
  // Ensure the consumer provided a valid function before measuring
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Lazy-load web-vitals to keep initial bundle size minimal
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Invoke each metric reporter with the provided callback
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Default export to integrate with CRA entrypoint
export default reportWebVitals;
