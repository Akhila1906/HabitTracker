import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from "@clerk/clerk-react";


export const ProfileCard: React.FC = () => {
  const { userProfile } = useHabits();
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const firstNameInitial = user.firstName?.[0] || '';
  const emailInitial = user.emailAddresses?.[0]?.emailAddress?.[0] || '';

  const experienceToNextLevel = userProfile.level * 100;
  const experiencePercentage = Math.round((userProfile.experience / experienceToNextLevel) * 100);
  
  return (
    <Card className="border-transparent bg-gradient-to-br from-primary/60 to-secondary/40">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex items-center justify-center h-16 w-16 rounded-full border-4 border-white bg-primary text-white text-xl font-bold">
            {firstNameInitial || emailInitial || 'U'}
          </div>
          <h3 className="font-bold text-lg">
            {user.firstName || user.emailAddresses?.[0]?.emailAddress || 'Unknown User'}
          </h3>
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
            Level {userProfile.level}
          </div>
          
          <div className="w-full space-y-1 mt-2">
            <div className="flex justify-between text-xs">
              <span>XP: {userProfile.experience}/{experienceToNextLevel}</span>
              <span>{experiencePercentage}%</span>
            </div>
            <Progress value={experiencePercentage} className="h-2 bg-white/20" />
          </div>
          
          <div className="flex space-x-2 mt-2">
            {userProfile.badges
              .filter(badge => badge.unlocked)
              .slice(0, 3)
              .map((badge) => (
                <div 
                  key={badge.id}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-lg"
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            
            {userProfile.badges.filter(badge => badge.unlocked).length > 3 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 text-sm font-medium">
                +{userProfile.badges.filter(badge => badge.unlocked).length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
