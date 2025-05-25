import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RoleManager from '@/components/auth/RoleManager';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
          Profile
        </h1>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.imageUrl} alt={user.fullName || "Avatar"} />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{user.fullName}</h3>
                <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>
              Manage your user role and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile; 