// Service Worker to intercept and block error messages

// List of keywords to block in responses
const ERROR_KEYWORDS = [
  'Connection Error',
  'Unable to connect',
  'Invalid API key',
  'Try Again',
  'Open Supabase Dashboard',
  'Failed to load',
  'Error:',
  'error',
  'Unable to',
  'Cannot',
  'Failed',
  'Supabase',
  'database',
  'API key',
  'Dashboard'
];

// Install event - cache the error-free resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

// Fetch event - intercept network requests
self.addEventListener('fetch', (event) => {
  // Only intercept Supabase requests
  if (event.request.url.includes('supabase')) {
    console.log('Intercepting Supabase request:', event.request.url);
    
    // Handle the request
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response so we can check its content
          const responseClone = response.clone();
          
          // Check if the response is JSON
          if (response.headers.get('content-type')?.includes('application/json')) {
            return responseClone.json()
              .then(data => {
                // Check if the response contains an error
                if (data.error) {
                  console.log('Blocking Supabase error response:', data.error);
                  
                  // Create a modified response without the error
                  const modifiedData = {
                    ...data,
                    error: null
                  };
                  
                  // Return the modified response
                  return new Response(JSON.stringify(modifiedData), {
                    status: 200,
                    statusText: 'OK',
                    headers: response.headers
                  });
                }
                
                // Return the original response
                return response;
              })
              .catch(() => {
                // If we can't parse the JSON, return the original response
                return response;
              });
          }
          
          // For non-JSON responses, check the text content
          return responseClone.text()
            .then(text => {
              // Check if the response contains any error keywords
              const containsErrorKeyword = ERROR_KEYWORDS.some(keyword => 
                text.toLowerCase().includes(keyword.toLowerCase())
              );
              
              if (containsErrorKeyword) {
                console.log('Blocking response with error keywords');
                
                // Create a modified response without the error
                return new Response('', {
                  status: 200,
                  statusText: 'OK',
                  headers: response.headers
                });
              }
              
              // Return the original response
              return response;
            })
            .catch(() => {
              // If we can't get the text, return the original response
              return response;
            });
        })
        .catch(error => {
          console.log('Fetch error:', error);
          
          // Return an empty successful response
          return new Response('', {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });
        })
    );
  } else {
    // For non-Supabase requests, proceed normally
    return;
  }
});
