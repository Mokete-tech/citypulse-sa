// This script will be loaded directly in the HTML
document.addEventListener('DOMContentLoaded', function() {
  console.log('Sidebar fix script loaded from public folder');
  
  // Add CSS directly to the head
  const style = document.createElement('style');
  style.textContent = `
    .sidebar {
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
    
    .sidebar-closed .sidebar {
      transform: translateX(-256px);
    }
    
    .main-content {
      margin-left: 256px;
      transition: margin-left 0.3s ease;
      width: 100%;
    }
    
    .sidebar-closed .main-content {
      margin-left: 0;
    }
    
    .sidebar-toggle {
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
    
    .sidebar-closed .sidebar-toggle {
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
    
    .sidebar-open .sidebar-overlay {
      display: block;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-256px);
      }
      
      .sidebar-open .sidebar {
        transform: translateX(0);
      }
      
      .main-content {
        margin-left: 0;
      }
      
      .sidebar-toggle {
        display: none;
      }
    }
  `;
  
  document.head.appendChild(style);
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'sidebar-toggle';
  toggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  document.body.appendChild(toggleButton);
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
  // Initialize sidebar state
  const isClosed = localStorage.getItem('sidebarClosed') === 'true';
  if (isClosed) {
    document.body.classList.add('sidebar-closed');
  } else {
    document.body.classList.remove('sidebar-closed');
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
});
