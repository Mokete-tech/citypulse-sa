
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Users, Shield, Zap } from 'lucide-react';

const AuthModalHeader = () => {
  return (
    <>
      <DialogHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to CityPulse
          </DialogTitle>
          <p className="text-gray-600 mt-2 text-sm">
            Join thousands discovering the best deals and events in South Africa
          </p>
        </div>
      </DialogHeader>

      <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xs text-gray-600 font-medium">50K+ Users</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Shield className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-gray-600 font-medium">Secure</p>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Zap className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs text-gray-600 font-medium">AI Powered</p>
        </div>
      </div>
    </>
  );
};

export default AuthModalHeader;
