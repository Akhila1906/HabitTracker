
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, LogOut, Users } from 'lucide-react';
import { FollowersList } from '@/components/FollowersList';
import { HabitList } from '@/components/HabitList';

// Mock data for demo purposes
const mockFollowers = [
  { id: '1', username: 'jane_doe', avatarUrl: null },
  { id: '2', username: 'john_smith', avatarUrl: null },
  { id: '3', username: 'alex_fitness', avatarUrl: null },
  { id: '4', username: 'habit_tracker', avatarUrl: null },
];

const mockFollowing = [
  { id: '5', username: 'fitness_guru', avatarUrl: null },
  { id: '6', username: 'meditation_master', avatarUrl: null },
  { id: '7', username: 'productivity_pro', avatarUrl: null },
];

type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  if (!user) {
    return <div className="container py-10 text-center">Loading...</div>;
  }
  
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                  <AvatarFallback className="text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                
                <div className="flex gap-4 w-full">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => setIsFollowersOpen(true)}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{mockFollowers.length}</span>
                      <span className="text-xs">Followers</span>
                    </div>
                  </Button>
                  
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => setIsFollowingOpen(true)}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{mockFollowing.length}</span>
                      <span className="text-xs">Following</span>
                    </div>
                  </Button>
                </div>
                
                <div className="flex gap-2 w-full">
                  <Button className="flex-1" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    className="flex-1" 
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
        
        <main>
          <Tabs defaultValue="habits">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="habits">My Habits</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="habits">
              <HabitList />
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader>Achievements</CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No achievements yet</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start completing your habits to earn achievements
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Followers Dialog */}
      <Dialog open={isFollowersOpen} onOpenChange={setIsFollowersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Followers</DialogTitle>
          </DialogHeader>
          <FollowersList users={mockFollowers} emptyMessage="No followers yet" />
        </DialogContent>
      </Dialog>
      
      {/* Following Dialog */}
      <Dialog open={isFollowingOpen} onOpenChange={setIsFollowingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Following</DialogTitle>
          </DialogHeader>
          <FollowersList users={mockFollowing} emptyMessage="Not following anyone yet" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
