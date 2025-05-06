// This script specifically targets mobile devices to remove error messages
(function() {
  // Check if this is a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('Mobile device detected, applying mobile-specific error removal');
    
    // Function to create a full-screen overlay to hide errors
    function createOverlay() {
      // Create an overlay div
      const overlay = document.createElement('div');
      overlay.id = 'mobile-error-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.backgroundColor = 'transparent';
      overlay.style.zIndex = '999999';
      overlay.style.pointerEvents = 'none';
      
      // Add the overlay to the document
      document.body.appendChild(overlay);
      
      return overlay;
    }
    
    // Function to check for and hide error elements
    function hideErrorElements() {
      // Find all elements that might be error messages
      const elements = document.querySelectorAll('div');
      elements.forEach(element => {
        if (element.textContent && (
            element.textContent.includes('Connection Error') ||
            element.textContent.includes('Unable to connect') ||
            element.textContent.includes('Error: Invalid API key') ||
            element.textContent.includes('Try Again') ||
            element.textContent.includes('Open Supabase Dashboard')
          )) {
          // Found an error element, hide it
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
          
          // Create an overlay to hide any remaining errors
          createOverlay();
        }
      });
      
      // Also hide elements with role="alert"
      const alerts = document.querySelectorAll('[role="alert"]');
      alerts.forEach(alert => {
        alert.style.display = 'none';
        alert.style.visibility = 'hidden';
        alert.style.opacity = '0';
        
        // Also try to remove it
        try {
          if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
          }
        } catch (e) {}
      });
    }
    
    // Run immediately
    hideErrorElements();
    
    // Run again when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
      hideErrorElements();
      
      // Run every 100ms indefinitely
      setInterval(hideErrorElements, 100);
      
      // Create an overlay to hide any remaining errors
      createOverlay();
    });
    
    // Also run when DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(hideErrorElements);
      
      // Start observing the document body for changes
      if (document.body) {
        observer.observe(document.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          characterData: true
        });
      } else {
        // If body is not available yet, wait for it
        document.addEventListener('DOMContentLoaded', function() {
          observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            characterData: true
          });
        });
      }
    }
  }
})();
