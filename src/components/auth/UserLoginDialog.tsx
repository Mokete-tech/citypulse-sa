import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import UserLogin from './UserLogin';

interface UserLoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

const UserLoginDialog = ({ trigger, className }: UserLoginDialogProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm" className={`bg-sa-blue text-white hover:bg-sa-blue/90 font-bold shadow-md ${className}`}>
            <LogIn className="h-4 w-4 mr-2" />
            Client Login
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Login</DialogTitle>
          <DialogDescription>
            Sign in to your CityPulse account to save your favorite deals and events.
          </DialogDescription>
        </DialogHeader>
        <UserLogin onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UserLoginDialog;
