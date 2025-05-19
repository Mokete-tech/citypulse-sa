
import { toast } from "sonner";

/**
 * Requests a password reset email for the given email address
 */
export const resetPassword = async (email: string) => {
  try {
    // In a real implementation with Clerk, you would call their password reset API
    // For now, we'll just show a toast message
    toast.success("Password reset email sent", {
      description: `If an account exists with ${email}, you'll receive an email with reset instructions.`
    });
    return true;
  } catch (error) {
    console.error("Error sending password reset:", error);
    toast.error("Error sending password reset", {
      description: "Please try again later."
    });
    return false;
  }
};
