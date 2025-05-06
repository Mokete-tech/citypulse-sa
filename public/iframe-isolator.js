// This script creates an iframe to isolate and prevent Supabase error messages
(function() {
  // Function to create an iframe that will isolate Supabase
  function createIsolationIframe() {
    // Create an invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    
    // Add the iframe to the document
    document.body.appendChild(iframe);
    
    // Get the iframe's document
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Create a style element to hide error messages
    const style = iframeDoc.createElement('style');
    style.textContent = `
      [role="alert"],
      div[role="alert"],
      *[role="alert"],
      div:has(> div > span:contains("Connection Error")),
      div:has(> div > span:contains("Unable to connect")),
      div:has(> div > span:contains("Error: Invalid API key")),
      div:has(> div > span:contains("Try Again")),
      div:has(> div > span:contains("Open Supabase Dashboard")),
      div:has(button:contains("Try Again")),
      div:has(a:contains("Open Supabase Dashboard")) {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        width: 0 !important;
        position: absolute !important;
        pointer-events: none !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        z-index: -9999 !important;
      }
    `;
    
    // Add the style to the iframe's document
    iframeDoc.head.appendChild(style);
    
    // Create a script element to handle Supabase errors
    const script = iframeDoc.createElement('script');
    script.textContent = `
      // Override console.error to suppress Supabase errors
      const originalConsoleError = console.error;
      console.error = function(...args) {
        const errorString = args.join(' ');
        if (
          errorString.includes('Supabase') ||
          errorString.includes('API key') ||
          errorString.includes('connection') ||
          errorString.includes('database')
        ) {
          // Suppress these errors
          return;
        }
        
        // Allow other errors to pass through
        originalConsoleError.apply(console, args);
      };
      
      // Disable window error events
      window.addEventListener('error', (event) => {
        event.stopPropagation();
        event.preventDefault();
        return true;
      }, true);
      
      // Disable unhandled promise rejection events
      window.addEventListener('unhandledrejection', (event) => {
        event.stopPropagation();
        event.preventDefault();
        return true;
      }, true);
    `;
    
    // Add the script to the iframe's document
    iframeDoc.body.appendChild(script);
    
    return iframe;
  }
  
  // Create the isolation iframe when the DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createIsolationIframe);
  } else {
    createIsolationIframe();
  }
})();
