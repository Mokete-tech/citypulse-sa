import { describe, it, expect } from 'vitest';
import { checkEnvironmentVariables, getEnvironmentWarningMessage } from './env-checker';

describe('Environment Checker', () => {
  it('should return environment check results', () => {
    const result = checkEnvironmentVariables();
    
    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('missingVars');
    expect(result).toHaveProperty('usingFallbacks');
    expect(result).toHaveProperty('warnings');
    
    expect(Array.isArray(result.missingVars)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(typeof result.isValid).toBe('boolean');
    expect(typeof result.usingFallbacks).toBe('boolean');
  });
  
  it('should return a warning message or null', () => {
    const message = getEnvironmentWarningMessage();
    
    // The message could be null or a string depending on the environment
    if (message !== null) {
      expect(typeof message).toBe('string');
    } else {
      expect(message).toBeNull();
    }
  });
});
