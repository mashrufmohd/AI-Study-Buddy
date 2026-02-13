import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAuthService, type MockUser } from '@/lib/mockAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Mail, Edit2, Check, X } from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<MockUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setDisplayName(currentUser.displayName);
    setIsLoading(false);
  }, [navigate]);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast({
        title: 'Error',
        description: 'Name cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    if (user) {
      // Update user in mock auth
      const updatedUser = { ...user, displayName };
      // Store updated user in localStorage
      const users = JSON.parse(localStorage.getItem('study-buddy-users') || '{}');
      if (users[user.email]) {
        users[user.email].displayName = displayName;
        localStorage.setItem('study-buddy-users', JSON.stringify(users));
      }
      localStorage.setItem('study-buddy-current-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await mockAuthService.logout();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <User className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* User Avatar and Name Summary */}
            <div className="flex items-center gap-6 pb-8 border-b">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                  {getInitials(user.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user.displayName}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✓ Active Account
                </div>
              </div>
            </div>

            {/* Full Name Field */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Full Name</Label>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUpdateProfile}
                      className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Check className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDisplayName(user.displayName);
                        setIsEditing(false);
                      }}
                      className="flex-1 gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-lg border border-border">
                  <p className="text-lg font-medium">{user.displayName}</p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <div className="p-4 bg-muted rounded-lg border border-border">
                <p className="text-lg font-medium">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900">Account Status</h3>
              <p className="text-sm text-blue-800">
                Your account is active and you can access all study features.
              </p>
              <p className="text-sm text-blue-700 mt-3">
                <strong>Member Since:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Logout Button */}
            <div className="pt-8 border-t">
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="lg"
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
