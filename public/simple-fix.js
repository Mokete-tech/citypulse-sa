// Enhanced sidebar and navbar fix
(function() {
  // Wait for DOM to be fully loaded
  function init() {
    console.log('Enhanced sidebar and navbar fix loaded');

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
        event.preventDefault();
        event.stopPropagation();
      }
    });

    // Create toggle button for desktop
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.setAttribute('data-sidebar-toggle', 'true');
    toggleButton.innerHTML = `
      <div style="background-color: white; border: 1px solid #e2e8f0; border-radius: 0 4px 4px 0; padding: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </div>
    `;
    document.body.appendChild(toggleButton);

    // Fix any z-index issues
    const style = document.createElement('style');
    style.textContent = `
      .sidebar-toggle {
        z-index: 60 !important;
      }

      @media (max-width: 768px) {
        .sidebar-toggle {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    console.log('Enhanced sidebar and navbar fix applied');
  }

  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
