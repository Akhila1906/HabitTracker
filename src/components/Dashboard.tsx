import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/types/habit';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { userProfile, habits } = useHabits();
  // const { user, isSignedIn } = useUser();

  
  const totalHabits = habits.length;
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(todayStr)
  ).length;
  
  const completionPercentage = totalHabits > 0 
    ? Math.round((completedToday / totalHabits) * 100) 
    : 0;
    
  const experienceToNextLevel = userProfile.level * 100;
  const experiencePercentage = Math.round((userProfile.experience / experienceToNextLevel) * 100);
  
  const unlockedBadges = userProfile.badges.filter(badge => badge.unlocked);
  
  return (
    <div className="w-full space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="habit-card">
          <h3 className="text-xl font-semibold mb-2">Overall Streak</h3>
          <p className="text-muted-foreground mb-4">
            {completedToday} of {totalHabits} habits completed
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-habit-background" />
          </div>
        </div>
        
        <div className="habit-card">
          <h3 className="text-xl font-semibold mb-2">Today's Progress</h3>
          <p className="text-muted-foreground mb-4">
            {completedToday} of {totalHabits} habits completed
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-habit-background" />
          </div>
        </div>
        
        <div className="habit-card">
          <h3 className="text-xl font-semibold mb-2">Level {userProfile.level}</h3>
          <p className="text-muted-foreground mb-4">
            {userProfile.experience} / {experienceToNextLevel} XP to level {userProfile.level + 1}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Experience</span>
              <span className="text-sm font-medium">{experiencePercentage}%</span>
            </div>
            <Progress value={experiencePercentage} className="h-2 bg-habit-background" />
          </div>
        </div>
      </section>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        {unlockedBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {unlockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Complete habits to earn badges!</p>
          </div>
        )}
      </section>
      
      <section>
        <h3 className="text-xl font-semibold mb-4">Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Habits"
            value={habits.length.toString()}
            icon="📊"
          />
          <StatCard
            title="Highest Streak"
            value={Math.max(...habits.map(h => h.streak), 0).toString()}
            icon="🔥"
          />
          <StatCard
            title="Completed Today"
            value={completedToday.toString()}
            icon="✅"
          />
          <StatCard
            title="Badges Earned"
            value={unlockedBadges.length.toString()}
            icon="🏆"
          />
        </div>
      </section>
    </div>
  );
};

const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  return (
    <div 
      className="p-4 rounded-lg flex flex-col items-center text-center space-y-2"
      style={{ backgroundColor: `${badge.color}15` }} // Semi-transparent badge color
    >
      <div 
        className="habit-badge text-2xl"
        style={{ backgroundColor: badge.color }}
      >
        {badge.icon}
      </div>
      <h4 className="font-medium">{badge.name}</h4>
      <p className="text-xs text-muted-foreground">{badge.description}</p>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: string }> = ({ 
  title, value, icon 
}) => {
  return (
    <div className="habit-card items-center text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};
