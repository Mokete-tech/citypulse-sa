// Simple sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
  console.log('Simple sidebar toggle loaded');
  
  // Initialize from localStorage
  const isClosed = localStorage.getItem('sidebarClosed') === 'true';
  if (isClosed) {
    document.body.classList.add('sidebar-closed');
  }
  
  // Create toggle button
  const toggleButton = document.createElement('button');
  toggleButton.className = 'sidebar-toggle';
  toggleButton.innerHTML = `
    <button style="background-color: white; border: 1px solid #e2e8f0; border-radius: 0 4px 4px 0; padding: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
  `;
  document.body.appendChild(toggleButton);
  
  // Create overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);
  
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
