import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthModalHeader from './AuthModalHeader';
import AuthProviderSelection from './AuthProviderSelection';
import AuthSignInForm from './AuthSignInForm';
import AuthSignUpForm from './AuthSignUpForm';
import GoogleAuthForm from './GoogleAuthForm';
import SMSAuthForm from './SMSAuthForm';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

type AuthProvider = 'selection' | 'email' | 'google' | 'sms';
type AuthMode = 'signin' | 'signup';

const EnhancedAuthModal = ({ isOpen, onClose, defaultTab = 'signin' }: EnhancedAuthModalProps) => {
  const [currentProvider, setCurrentProvider] = useState<AuthProvider>('selection');
  const [authMode, setAuthMode] = useState<AuthMode>(defaultTab);

  const handleProviderSelect = (provider: 'email' | 'google' | 'sms') => {
    setCurrentProvider(provider);
  };

  const handleBackToSelection = () => {
    setCurrentProvider('selection');
  };

  const handleClose = () => {
    setCurrentProvider('selection');
    setAuthMode('signin');
    onClose();
  };

  const renderAuthContent = () => {
    switch (currentProvider) {
      case 'selection':
        return (
          <AuthProviderSelection 
            onProviderSelect={handleProviderSelect}
          />
        );
      
      case 'email':
        return (
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as AuthMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <AuthSignInForm 
                onClose={handleClose}
                onBack={handleBackToSelection}
                showBack={true}
              />
            </TabsContent>
            
            <TabsContent value="signup">
              <AuthSignUpForm 
                onClose={handleClose}
                onBack={handleBackToSelection}
                showBack={true}
              />
            </TabsContent>
          </Tabs>
        );
      
      case 'google':
        return (
          <GoogleAuthForm 
            onBack={handleBackToSelection}
            onClose={handleClose}
          />
        );
      
      case 'sms':
        return (
          <SMSAuthForm 
            onBack={handleBackToSelection}
            onClose={handleClose}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60" />
          
          {/* Content */}
          <div className="relative">
            <AuthModalHeader />
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProvider}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderAuthContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAuthModal;
