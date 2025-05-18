
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const isValidPhone = (phone: string): boolean => {
  // Basic phone number validation with country code
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const normalizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except '+'
  return phone.replace(/[^\d+]/g, '');
};

export const formatPhoneNumber = (phone: string): string => {
  // This is a simple formatter, can be expanded based on regional requirements
  if (!phone) return '';
  
  const normalized = normalizePhoneNumber(phone);
  
  // For a number like +27123456789, format as +27 12 345 6789
  if (normalized.startsWith('+')) {
    const countryCode = normalized.slice(0, 3); // e.g. +27
    const rest = normalized.slice(3);
    
    if (rest.length <= 3) {
      return `${countryCode} ${rest}`;
    } else if (rest.length <= 6) {
      return `${countryCode} ${rest.slice(0, 2)} ${rest.slice(2)}`;
    } else {
      return `${countryCode} ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
    }
  }
  
  return normalized;
};

export const isValidBusinessName = (name: string): boolean => {
  return name.length >= 2;
};

export const isValidLocation = (location: string): boolean => {
  return location.length >= 2;
};

export const checkPasswordStrength = (password: string): { score: number, feedback: string } => {
  if (!password) {
    return { score: 0, feedback: 'Password is required.' };
  }
  
  let score = 0;
  let feedback = '';
  
  // Length check
  if (password.length < 8) {
    feedback = 'Password should be at least 8 characters long.';
  } else {
    score += 1;
  }
  
  // Check for numbers
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback += ' Include at least one number.';
  }
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback += ' Include at least one lowercase letter.';
  }
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback += ' Include at least one uppercase letter.';
  }
  
  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback += ' Include at least one special character.';
  }
  
  // If score is high but no feedback was given yet, provide positive feedback
  if (score >= 4 && !feedback) {
    feedback = 'Strong password!';
  } else if (score >= 3 && !feedback) {
    feedback = 'Decent password, consider adding more variety.';
  }
  
  return { score, feedback: feedback.trim() };
};
