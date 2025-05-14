// This script fixes image loading issues by providing fallbacks
(function() {
  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // Create embedded SVG fallbacks for different image types
  const fallbacks = {
    deal: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EDeal%20Image%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Cpath%20d%3D%22M50%2C0%20L100%2C50%20L50%2C100%20L0%2C50%20Z%22%20fill%3D%22%233b82f6%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%233b82f6%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2255%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%233b82f6%22%20text-anchor%3D%22middle%22%3E50%25%20OFF%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E',
    
    event: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3EEvent%20Image%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%20fill%3D%22%238b5cf6%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%238b5cf6%22%20stroke-width%3D%222%22%2F%3E%3Cpath%20d%3D%22M50%2C25%20L55%2C45%20L75%2C45%20L60%2C55%20L65%2C75%20L50%2C65%20L35%2C75%20L40%2C55%20L25%2C45%20L45%2C45%20Z%22%20fill%3D%22%238b5cf6%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E',
    
    general: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23f0f4f8%22%2F%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a0aec0%22%20stroke-width%3D%222%22%3E%3Crect%20x%3D%22150%22%20y%3D%22100%22%20width%3D%22500%22%20height%3D%22250%22%20rx%3D%228%22%20stroke-dasharray%3D%228%204%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2364748b%22%20text-anchor%3D%22middle%22%3ECityPulse%3C%2Ftext%3E%3Cg%20transform%3D%22translate%28350%2C%20260%29%22%3E%3Crect%20x%3D%2225%22%20y%3D%2225%22%20width%3D%2250%22%20height%3D%2250%22%20rx%3D%224%22%20fill%3D%22%230ea5e9%22%20fill-opacity%3D%220.2%22%20stroke%3D%22%230ea5e9%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2255%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%230ea5e9%22%20text-anchor%3D%22middle%22%20font-weight%3D%22bold%22%3ECP%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fsvg%3E'
  };

  // Fix broken images
  function fixBrokenImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Skip images that are already using data URIs
      if (img.src && img.src.startsWith('data:')) return;
      
      // Handle error when image fails to load
      img.onerror = function() {
        // Determine image type based on src, alt, or parent elements
        let imageType = 'general';
        
        const src = img.src || '';
        const alt = img.alt || '';
        const parentText = img.parentElement ? img.parentElement.textContent || '' : '';
        
        if (src.includes('deal') || alt.includes('deal') || parentText.includes('deal')) {
          imageType = 'deal';
        } else if (src.includes('event') || alt.includes('event') || parentText.includes('event')) {
          imageType = 'event';
        }
        
        // Set fallback image
        img.src = fallbacks[imageType];
        
        // Add a class to indicate this is a fallback
        img.classList.add('image-fallback');
        
        // Prevent infinite error loop
        img.onerror = null;
      };
      
      // Force reload for images that might be broken but haven't triggered error
      if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
        img.src = img.src;
      }
    });
  }

  // Run the fix when DOM is ready
  ready(function() {
    fixBrokenImages();
    
    // Also run when DOM changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        fixBrokenImages();
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
      });
    }
  });
  
  // Run again after everything has loaded
  window.addEventListener('load', fixBrokenImages);
  
  // Run periodically to catch any missed images
  setInterval(fixBrokenImages, 3000);
})();
