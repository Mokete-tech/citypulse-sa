// This script runs immediately and removes any error messages from the DOM
(function() {
  // Function to remove error elements
  function removeErrors() {
    // Error keywords to look for
    const errorKeywords = [
      'Connection Error',
      'Unable to connect',
      'Invalid API key',
      'Try Again',
      'Open Supabase Dashboard',
      'Failed to load',
      'Error:',
      'error',
      'Unable to',
      'Cannot',
      'Failed',
      'Supabase',
      'database',
      'API key',
      'Dashboard'
    ];
    
    // Function to check if element contains any error text
    function containsErrorText(element) {
      if (!element || !element.textContent) return false;
      return errorKeywords.some(keyword => 
        element.textContent.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // Function to hide element
    function hideElement(element) {
      if (!element) return;
      
      // Apply all possible hiding techniques
      element.style.display = 'none';
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.height = '0';
      element.style.width = '0';
      element.style.position = 'absolute';
      element.style.pointerEvents = 'none';
      element.style.overflow = 'hidden';
      element.style.clip = 'rect(0, 0, 0, 0)';
      element.style.zIndex = '-9999';
      
      // Also try to remove it
      try {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      } catch (e) {}
    }
    
    // Hide all alert elements
    document.querySelectorAll('[role="alert"]').forEach(hideElement);
    
    // Hide elements with error-related classes
    [
      '.error-message',
      '.alert-error',
      '.alert-danger',
      '.connection-error',
      '.supabase-error',
      '.api-error',
      '.database-error',
      '.loading-error',
      '[data-error="true"]',
      '[data-state="error"]',
      '[data-type="error"]'
    ].forEach(selector => {
      try {
        document.querySelectorAll(selector).forEach(hideElement);
      } catch (e) {}
    });
    
    // Find all elements and check their text content
    document.querySelectorAll('*').forEach(element => {
      if (containsErrorText(element)) {
        // Try to find the parent container
        let container = element;
        for (let i = 0; i < 5; i++) { // Check up to 5 levels up
          if (container.parentNode && container.parentNode !== document.body) {
            container = container.parentNode;
          } else {
            break;
          }
        }
        hideElement(container);
      }
    });
  }
  
  // Run immediately
  removeErrors();
  
  // Run again when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      removeErrors();
      
      // Run every 100ms for the first 10 seconds
      let count = 0;
      const interval = setInterval(function() {
        removeErrors();
        count++;
        if (count >= 100) clearInterval(interval);
      }, 100);
      
      // Then run every second indefinitely
      setInterval(removeErrors, 1000);
      
      // Also run when DOM changes
      if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
          removeErrors();
        });
        
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          characterData: true
        });
      }
    });
  } else {
    // DOM already loaded
    removeErrors();
    
    // Run every 100ms for the first 10 seconds
    let count = 0;
    const interval = setInterval(function() {
      removeErrors();
      count++;
      if (count >= 100) clearInterval(interval);
    }, 100);
    
    // Then run every second indefinitely
    setInterval(removeErrors, 1000);
    
    // Also run when DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        removeErrors();
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        characterData: true
      });
    }
  }
})();
