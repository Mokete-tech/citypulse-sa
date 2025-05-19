
import { describe, it, expect } from 'vitest';
import { supabase } from './client';

describe('Supabase Client', () => {
  it('should initialize a supabase client', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  // Test auth functions availability without calling them
  it('should have auth functions available', () => {
    expect(typeof supabase.auth.signUp).toBe('function');
    expect(typeof supabase.auth.signOut).toBe('function');
  });
});
