import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoleManager = () => {
  const { user } = useUser();
  const { session } = useClerk();
  const [isLoading, setIsLoading] = React.useState(false);

  const updateRole = async (role: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await user.update({
        publicMetadata: {
          role,
        },
      });
      
      toast.success('Role updated successfully');
    } catch (error: any) {
      toast.error('Failed to update role', {
        description: error.message || 'Could not update role'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = user?.publicMetadata?.role as string || 'user';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">User Role</h3>
        <p className="text-sm text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <Select
          value={currentRole}
          onValueChange={updateRole}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="merchant">Merchant</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          onClick={() => updateRole('user')}
          disabled={isLoading || currentRole === 'user'}
        >
          Reset to User
        </Button>
      </div>
    </div>
  );
};

export default RoleManager; 