// Simple sidebar toggle fix
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple sidebar fix loaded');
  
  // Add CSS to fix the sidebar
  const style = document.createElement('style');
  style.textContent = `
    /* Fix for sidebar toggle */
    .sidebar-container {
      transition: transform 0.3s ease !important;
      transform: translateX(0) !important;
      width: 256px !important;
    }
    
    body.sidebar-closed .sidebar-container {
      transform: translateX(-256px) !important;
    }
    
    .main-content {
      transition: margin-left 0.3s ease !important;
      margin-left: 256px !important;
    }
    
    body.sidebar-closed .main-content {
      margin-left: 0 !important;
    }
    
    @media (max-width: 768px) {
      .sidebar-container {
        transform: translateX(-256px) !important;
      }
      
      .main-content {
        margin-left: 0 !important;
      }
      
      body.sidebar-open .sidebar-container {
        transform: translateX(0) !important;
      }
    }
  `;
  document.head.appendChild(style);
  
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
});
