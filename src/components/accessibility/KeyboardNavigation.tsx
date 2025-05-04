import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const KeyboardNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contentEditable element
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Alt + key shortcuts for main navigation
      if (e.altKey) {
        switch (e.key) {
          case 'h': // Home
            e.preventDefault();
            navigate('/');
            toast.info('Navigated to Home');
            break;
          case 'd': // Deals
            e.preventDefault();
            navigate('/deals');
            toast.info('Navigated to Deals');
            break;
          case 'e': // Events
            e.preventDefault();
            navigate('/events');
            toast.info('Navigated to Events');
            break;
          case 'm': // Merchant
            e.preventDefault();
            navigate('/merchant/login');
            toast.info('Navigated to Merchant Login');
            break;
          case 'p': // Packages
            e.preventDefault();
            navigate('/merchant/packages');
            toast.info('Navigated to Merchant Packages');
            break;
          case '?': // Help
            e.preventDefault();
            showKeyboardShortcutsHelp();
            break;
        }
      }
    };

    const showKeyboardShortcutsHelp = () => {
      toast.info(
        'Keyboard Shortcuts',
        {
          description: (
            <div className="text-sm">
              <p className="font-medium mb-2">Navigation:</p>
              <ul className="space-y-1">
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + H</kbd> Home</li>
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + D</kbd> Deals</li>
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + E</kbd> Events</li>
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + M</kbd> Merchant Login</li>
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + P</kbd> Merchant Packages</li>
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Alt + ?</kbd> Show this help</li>
              </ul>
              <p className="font-medium mt-3 mb-2">Search:</p>
              <ul className="space-y-1">
                <li><kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl + K</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 rounded">⌘ + K</kbd> Open search</li>
              </ul>
            </div>
          ),
          duration: 10000,
          action: {
            label: 'Dismiss',
            onClick: () => {}
          }
        }
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Show keyboard shortcuts help on first visit
    const hasSeenKeyboardHelp = localStorage.getItem('hasSeenKeyboardHelp');
    if (!hasSeenKeyboardHelp) {
      // Delay to ensure the app is fully loaded
      const timer = setTimeout(() => {
        showKeyboardShortcutsHelp();
        localStorage.setItem('hasSeenKeyboardHelp', 'true');
      }, 3000);
      
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return null; // This is a behavior-only component
};

export default KeyboardNavigation;
