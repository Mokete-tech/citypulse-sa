/**
 * Validation utilities for form inputs
 */

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param phone The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export function isValidPhone(phone: string): boolean {
  // Phone number must start with + followed by digits
  // This is a basic validation, can be made more specific for different countries
  const phoneRegex = /^\+[0-9]{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Validates a password
 * @param password The password to validate
 * @returns True if the password is valid, false otherwise
 */
export function isValidPassword(password: string): boolean {
  // Password must be at least 8 characters
  return password.length >= 8;
}

/**
 * Checks password strength
 * @param password The password to check
 * @returns An object with the strength score and feedback
 */
export function checkPasswordStrength(password: string): { 
  score: number; 
  feedback: string;
} {
  let score = 0;
  const feedback = [];

  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  } else {
    score += 1;
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }

  // Contains numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }

  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }

  return {
    score,
    feedback: feedback.join(', ')
  };
}

/**
 * Formats a phone number for display
 * @param phone The phone number to format
 * @returns The formatted phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except the leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if the number starts with a +
  if (cleaned.startsWith('+')) {
    // Format international number: +XX XXX XXX XXXX
    const match = cleaned.match(/^\+(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  // Return the cleaned number if it doesn't match the pattern
  return cleaned;
}

/**
 * Normalizes a phone number for API calls
 * @param phone The phone number to normalize
 * @returns The normalized phone number
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters except the leading +
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Validates a business name
 * @param name The business name to validate
 * @returns True if the business name is valid, false otherwise
 */
export function isValidBusinessName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Validates a location
 * @param location The location to validate
 * @returns True if the location is valid, false otherwise
 */
export function isValidLocation(location: string): boolean {
  return location.trim().length >= 2;
}
