import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Smartphone, Chrome, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthProviderSelectionProps {
  onProviderSelect: (provider: 'email' | 'google' | 'sms') => void;
  onBack?: () => void;
  showBack?: boolean;
}

const AuthProviderSelection = ({ onProviderSelect, onBack, showBack = false }: AuthProviderSelectionProps) => {
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  const providers = [
    {
      id: 'email',
      name: 'Email & Password',
      description: 'Sign in with your email address',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
    },
    {
      id: 'google',
      name: 'Google Account',
      description: 'Continue with your Google account',
      icon: Chrome,
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
    },
    {
      id: 'sms',
      name: 'Phone Number',
      description: 'Sign in with SMS verification',
      icon: Smartphone,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
    },
  ];

  return (
    <div className="space-y-6">
      {showBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to options
        </Button>
      )}

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Choose how to continue</h3>
        <p className="text-sm text-gray-600">Select your preferred sign-in method</p>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isHovered = hoveredProvider === provider.id;
          
          return (
            <motion.div
              key={provider.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredProvider(provider.id)}
              onHoverEnd={() => setHoveredProvider(null)}
            >
              <Card
                className={`p-4 cursor-pointer border-2 transition-all duration-200 ${
                  isHovered 
                    ? 'border-blue-300 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm'
                }`}
                onClick={() => onProviderSelect(provider.id as 'email' | 'google' | 'sms')}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${isHovered ? provider.hoverColor : provider.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default AuthProviderSelection;
