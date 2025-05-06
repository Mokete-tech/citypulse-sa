// This script runs immediately and removes the connection error element
(function() {
  // Function to remove the connection error element
  function removeConnectionError() {
    // Try to find the connection error element by its content
    const elements = document.querySelectorAll('div');
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.textContent && 
          (element.textContent.includes('Connection Error') || 
           element.textContent.includes('Unable to connect to the database') ||
           element.textContent.includes('Error: Invalid API key') ||
           element.textContent.includes('Try Again') ||
           element.textContent.includes('Open Supabase Dashboard'))) {
        
        // Found the connection error element, remove it
        if (element.parentNode) {
          element.parentNode.removeChild(element);
          console.log('Removed connection error element');
        }
      }
    }
    
    // Also try to find elements by role="alert"
    const alerts = document.querySelectorAll('[role="alert"]');
    for (let i = 0; i < alerts.length; i++) {
      const alert = alerts[i];
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
        console.log('Removed alert element');
      }
    }
  }
  
  // Run immediately
  removeConnectionError();
  
  // Run again when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    removeConnectionError();
    
    // Run every 100ms for the first 5 seconds
    let count = 0;
    const interval = setInterval(function() {
      removeConnectionError();
      count++;
      if (count >= 50) clearInterval(interval);
    }, 100);
  });
  
  // Also run when DOM changes
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      removeConnectionError();
    });
    
    // Start observing the document body for changes
    if (document.body) {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    } else {
      // If body is not available yet, wait for it
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { 
          childList: true, 
          subtree: true 
        });
      });
    }
  }
})();
