import { createClient } from '@supabase/supabase-js';
import { toast } from '@/components/ui/sonner';
import { handleSupabaseError } from '@/lib/error-handler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the base client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create a proxy to handle errors and provide consistent behavior
const supabaseProxy = new Proxy(supabaseClient, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);

    // Special handling for the 'from' method to provide consistent error handling
    if (prop === 'from') {
      return function(table: string) {
        const originalFrom = value.call(target, table);

        return new Proxy(originalFrom, {
          get(fromTarget, fromProp, fromReceiver) {
            const fromValue = Reflect.get(fromTarget, fromProp, fromReceiver);

            // Wrap common database operations
            if (['select', 'insert', 'update', 'delete', 'upsert'].includes(String(fromProp))) {
              return function(...args: unknown[]) {
                const originalOperation = fromValue.apply(fromTarget, args);

                // Add error handling to the execute method
                const originalExecute = originalOperation.execute;
                if (originalExecute) {
                  originalOperation.execute = async function() {
                    try {
                      const result = await originalExecute.apply(this);
                      if (result.error) {
                        handleSupabaseError(result.error, {
                          title: `Database Error (${table})`,
                          message: `Operation failed: ${String(fromProp)}`
                        });
                      }
                      return result;
                    } catch (error: unknown) {
                      handleSupabaseError(error, {
                        title: `Database Error (${table})`,
                        message: `Operation failed: ${String(fromProp)}`
                      });
                      throw error;
                    }
                  };
                }

                return originalOperation;
              };
            }

            return fromValue;
          }
        });
      };
    }

    // If the property is a function, wrap it to handle errors
    if (typeof value === 'function') {
      return function(...args: unknown[]) {
        try {
          const result = value.apply(target, args);

          // If the result is a Promise, handle any errors
          if (result instanceof Promise) {
            return result.catch((error: unknown) => {
              handleSupabaseError(error, {
                title: 'Supabase Error',
                message: `Operation failed: ${String(prop)}`
              });
              throw error;
            });
          }

          return result;
        } catch (error: unknown) {
          handleSupabaseError(error, {
            title: 'Supabase Error',
            message: `Operation failed: ${String(prop)}`
          });
          throw error;
        }
      };
    }

    // If the property is an object (like auth, storage, etc.), proxy it too
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, {
        get(objTarget, objProp, objReceiver) {
          const objValue = Reflect.get(objTarget, objProp, objReceiver);

          if (typeof objValue === 'function') {
            return function(...args: unknown[]) {
              try {
                const result = objValue.apply(objTarget, args);

                if (result instanceof Promise) {
                  return result.catch((error: unknown) => {
                    handleSupabaseError(error, {
                      title: `Supabase ${String(prop)} Error`,
                      message: `Operation failed: ${String(objProp)}`
                    });
                    throw error;
                  });
                }

                return result;
              } catch (error: unknown) {
                handleSupabaseError(error, {
                  title: `Supabase ${String(prop)} Error`,
                  message: `Operation failed: ${String(objProp)}`
                });
                throw error;
              }
            };
          }

          return objValue;
        }
      });
    }

    return value;
  }
});

export const supabase = supabaseProxy;
