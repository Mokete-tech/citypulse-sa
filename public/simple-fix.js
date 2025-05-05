// Simple sidebar toggle fix
(function() {
  // Wait for DOM to be fully loaded
  function init() {
    console.log('Simple sidebar fix loaded');

    // Function to toggle sidebar
    function toggleSidebar() {
      if (window.innerWidth <= 768) {
        document.body.classList.toggle('sidebar-open');
      } else {
        document.body.classList.toggle('sidebar-closed');
      }

      localStorage.setItem('sidebarClosed', document.body.classList.contains('sidebar-closed'));
    }

    // Initialize sidebar state from localStorage
    if (localStorage.getItem('sidebarClosed') === 'true') {
      document.body.classList.add('sidebar-closed');
    }

    // Add click event listener for sidebar toggle buttons
    document.addEventListener('click', function(event) {
      if (event.target.closest('[data-sidebar-toggle]') ||
          event.target.closest('.sidebar-overlay')) {
        toggleSidebar();
      }
    });

    console.log('Sidebar fix applied');
  }

  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
