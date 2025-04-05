
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from 'lucide-react';

interface User {
  id: string;
  username: string;
  avatarUrl: string | null;
}

interface FollowersListProps {
  users: User[];
  emptyMessage: string;
}

export const FollowersList: React.FC<FollowersListProps> = ({ users, emptyMessage }) => {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.username}</p>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Follow
          </Button>
        </div>
      ))}
    </div>
  );
};
