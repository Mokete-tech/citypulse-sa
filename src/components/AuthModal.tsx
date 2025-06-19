
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthModalHeader from '@/components/auth/AuthModalHeader';
import AuthSignUpForm from '@/components/auth/AuthSignUpForm';
import AuthSignInForm from '@/components/auth/AuthSignInForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0 shadow-2xl">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative p-8">
            <AuthModalHeader />

            <Tabs defaultValue="signup" className="w-full mt-6">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl p-1">
                <TabsTrigger
                  value="signup"
                  className="rounded-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </TabsTrigger>
                <TabsTrigger
                  value="signin"
                  className="rounded-lg font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
              </TabsList>
              <TabsContent value="signup" className="mt-6">
                <AuthSignUpForm onClose={onClose} />
              </TabsContent>
              <TabsContent value="signin" className="mt-6">
                <AuthSignInForm onClose={onClose} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
