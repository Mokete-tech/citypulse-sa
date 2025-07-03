import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, ArrowLeft, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SMSAuthFormProps {
  onBack: () => void;
  onClose: () => void;
}

const SMSAuthForm = ({ onBack, onClose }: SMSAuthFormProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format phone number for South Africa
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+27' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+27' + formattedPhone;
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        throw error;
      }

      setStep('otp');
      toast.info("OTP Sent!", {
        description: `Verification code sent to ${formattedPhone}`
      });

    } catch (error) {
      console.error('SMS send error:', error);
      toast.error("SMS Error", {
        description: (error as Error).message || "Failed to send verification code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let formattedPhone = phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+27' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+27' + formattedPhone;
      }

      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        throw error;
      }

      toast.success("Welcome!", {
        description: "Successfully signed in with SMS verification."
      });
      onClose();

    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error("Verification Failed", {
        description: (error as Error).message || "Invalid verification code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={step === 'otp' ? () => setStep('phone') : onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {step === 'otp' ? 'Change phone number' : 'Back to options'}
      </Button>

      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
          {step === 'phone' ? (
            <Smartphone className="w-8 h-8 text-white" />
          ) : (
            <MessageSquare className="w-8 h-8 text-white" />
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {step === 'phone' ? 'Enter your phone number' : 'Enter verification code'}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {step === 'phone' 
              ? 'We\'ll send you a verification code via SMS' 
              : `Code sent to ${phone}`
            }
          </p>
        </div>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                +27
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="81 234 5678"
                className="pl-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white/80 backdrop-blur-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter your South African mobile number
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !phone.trim()}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Code...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="h-12 text-center text-lg font-mono tracking-widest border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl bg-white/80 backdrop-blur-sm"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify & Sign In'
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full text-green-600 hover:text-green-700"
          >
            Resend Code
          </Button>
        </form>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-green-500 mt-0.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-green-800 font-medium">SMS Verification</p>
            <p className="text-xs text-green-700 mt-1">
              Standard SMS rates may apply. Code expires in 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSAuthForm;
