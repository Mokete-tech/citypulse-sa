import { describe, it, expect } from 'vitest';
import { supabase, isUsingFallbackCredentials } from './client';

describe('Supabase Client', () => {
  it('should have a valid Supabase client instance', () => {
    expect(supabase).toBeDefined();
  });

  it('should have isUsingFallbackCredentials defined', () => {
    expect(typeof isUsingFallbackCredentials).toBe('boolean');
  });
});
