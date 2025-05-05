// This script will be loaded directly in the HTML
(function() {
  // Execute immediately when the script loads
  console.log('Direct fix script loaded');
  
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, applying sidebar fix');
    
    // Add CSS directly to the head
    const style = document.createElement('style');
    style.textContent = `
      /* Direct sidebar styles */
      .sidebar-container {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 256px;
        background-color: #1e40af;
        color: white;
        z-index: 50;
        transition: transform 0.3s ease;
        transform: translateX(0);
        overflow-y: auto;
      }
      
      body.sidebar-closed .sidebar-container {
        transform: translateX(-256px);
      }
      
      .main-content-wrapper {
        margin-left: 256px;
        transition: margin-left 0.3s ease;
        width: calc(100% - 256px);
      }
      
      body.sidebar-closed .main-content-wrapper {
        margin-left: 0;
        width: 100%;
      }
      
      .sidebar-toggle-btn {
        position: fixed;
        bottom: 20px;
        left: 256px;
        z-index: 60;
        background-color: white;
        border: 1px solid #e2e8f0;
        border-left: none;
        border-radius: 0 4px 4px 0;
        padding: 8px;
        cursor: pointer;
        transition: left 0.3s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      
      body.sidebar-closed .sidebar-toggle-btn {
        left: 0;
      }
      
      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 40;
        display: none;
      }
      
      body.sidebar-open .sidebar-overlay {
        display: block;
      }
      
      @media (max-width: 768px) {
        .sidebar-container {
          transform: translateX(-256px);
        }
        
        body.sidebar-open .sidebar-container {
          transform: translateX(0);
        }
        
        .main-content-wrapper {
          margin-left: 0;
          width: 100%;
        }
        
        .sidebar-toggle-btn {
          display: none;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Function to apply classes to existing elements
    function applyClasses() {
      // Find the sidebar and main content elements
      const sidebar = document.querySelector('.sidebar') || 
                     document.querySelector('[class*="sidebar"]');
      
      const mainContent = document.querySelector('.main-content') || 
                         document.querySelector('[class*="main-content"]');
      
      if (sidebar) {
        sidebar.classList.add('sidebar-container');
        console.log('Applied sidebar-container class to sidebar');
      } else {
        console.error('Could not find sidebar element');
      }
      
      if (mainContent) {
        mainContent.classList.add('main-content-wrapper');
        console.log('Applied main-content-wrapper class to main content');
      } else {
        console.error('Could not find main content element');
      }
    }
    
    // Apply classes immediately
    applyClasses();
    
    // Also apply classes after a short delay to ensure React has rendered
    setTimeout(applyClasses, 500);
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle-btn';
    toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
    document.body.appendChild(toggleButton);
    
    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Initialize sidebar state from localStorage
    const isClosed = localStorage.getItem('sidebarClosed') === 'true';
    if (isClosed) {
      document.body.classList.add('sidebar-closed');
    }
    
    // Toggle function
    function toggleSidebar() {
      if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-open');
      } else {
        document.body.classList.toggle('sidebar-closed');
      }
      
      const isClosed = document.body.classList.contains('sidebar-closed');
      localStorage.setItem('sidebarClosed', isClosed);
      console.log('Sidebar toggled, closed:', isClosed);
    }
    
    // Add event listeners
    toggleButton.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
    
    // Add event listener to all elements with data-sidebar-toggle attribute
    document.addEventListener('click', function(event) {
      if (event.target.closest('[data-sidebar-toggle]')) {
        toggleSidebar();
      }
    });
    
    // MutationObserver to watch for new elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          applyClasses();
        }
      });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('Sidebar fix fully applied');
  });
})();
