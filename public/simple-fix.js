// Simple sidebar toggle fix
(function() {
  // Wait for DOM to be fully loaded
  function init() {
    try {
      console.log('Simple sidebar toggle loaded');

      // Function to toggle sidebar
      function toggleSidebar() {
        try {
          if (window.innerWidth <= 768) {
            document.body.classList.toggle('sidebar-open');
          } else {
            document.body.classList.toggle('sidebar-closed');
          }

          try {
            localStorage.setItem('sidebarClosed', document.body.classList.contains('sidebar-closed'));
          } catch (e) {
            console.log('Could not save sidebar state to localStorage');
          }
        } catch (e) {
          console.log('Error in toggleSidebar:', e);
        }
      }

      // Initialize sidebar state from localStorage
      try {
        if (localStorage.getItem('sidebarClosed') === 'true') {
          document.body.classList.add('sidebar-closed');
        }
      } catch (e) {
        console.log('Could not read sidebar state from localStorage');
      }

      // Add click event listener for sidebar toggle buttons
      document.addEventListener('click', function(event) {
        try {
          if (event.target.closest('[data-sidebar-toggle]') ||
              event.target.closest('.sidebar-overlay')) {
            toggleSidebar();
          }
        } catch (e) {
          console.log('Error in click handler:', e);
        }
      });
    } catch (e) {
      console.log('Error initializing sidebar toggle:', e);
    }
  }

  // Run when DOM is loaded
  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (e) {
    console.log('Error setting up sidebar toggle:', e);
  }
})();
