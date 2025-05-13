import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { handleSupabaseError } from './error-handler';

/**
 * Resets a user's password by sending a password recovery email
 * @param email The email address of the user
 * @returns A promise that resolves when the password reset email is sent
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    toast.success('Password reset email sent', {
      description: 'Check your email for a link to reset your password',
    });
  } catch (error) {
    handleSupabaseError(error, {
      title: 'Password Reset Failed',
      message: 'Could not send password reset email. Please try again.',
      showInProduction: true,
    });
    throw error;
  }
}

/**
 * Updates a user's password
 * @param newPassword The new password
 * @returns A promise that resolves when the password is updated
 */
export async function updatePassword(newPassword: string): Promise<void> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    toast.success('Password updated', {
      description: 'Your password has been successfully updated',
    });
  } catch (error) {
    handleSupabaseError(error, {
      title: 'Password Update Failed',
      message: 'Could not update your password. Please try again.',
      showInProduction: true,
    });
    throw error;
  }
}

/**
 * Updates a user's profile information
 * @param profile The profile data to update
 * @returns A promise that resolves when the profile is updated
 */
export async function updateProfile(profile: {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  email?: string;
}): Promise<void> {
  try {
    // First update auth user if email is provided
    if (profile.email) {
      const { error } = await supabase.auth.updateUser({
        email: profile.email,
      });

      if (error) {
        throw error;
      }
    }

    // Then update profile in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        website: profile.website,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      throw error;
    }

    toast.success('Profile updated', {
      description: 'Your profile has been successfully updated',
    });
  } catch (error) {
    handleSupabaseError(error, {
      title: 'Profile Update Failed',
      message: 'Could not update your profile. Please try again.',
      showInProduction: true,
    });
    throw error;
  }
}
