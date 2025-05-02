/**
 * Utility functions for PWA functionality
 */

/**
 * Check if the app is running in standalone mode (installed as PWA)
 * @returns boolean indicating if the app is running as a PWA
 */
export const isRunningAsPWA = (): boolean => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as any).standalone === true // For iOS
  );
};

/**
 * Check if the app can be installed as a PWA
 * @returns boolean indicating if the app can be installed
 */
export const canInstallPWA = (): boolean => {
  return 'BeforeInstallPromptEvent' in window;
};

/**
 * Get the platform the user is on
 * @returns string indicating the platform (ios, android, desktop, or unknown)
 */
export const getPlatform = (): 'ios' | 'android' | 'desktop' | 'unknown' => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  // Assume desktop for anything else
  if (!/mobile/i.test(userAgent)) {
    return 'desktop';
  }
  
  return 'unknown';
};

/**
 * Check if the device is a mobile device
 * @returns boolean indicating if the device is mobile
 */
export const isMobileDevice = (): boolean => {
  const platform = getPlatform();
  return platform === 'ios' || platform === 'android';
};
