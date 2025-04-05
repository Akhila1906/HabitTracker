import React, { createContext, useContext, useState, useEffect } from 'react';
import { Habit, Badge, UserProfile } from '@/types/habit';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface HabitContextType {
  habits: Habit[];
  userProfile: UserProfile;
  addHabit: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'streak'>) => void;
  removeHabit: (id: string) => void;
  updateHabit: (habit: Habit) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  checkHabitCompletion: (id: string, date: string) => boolean;
}

const defaultBadges: Badge[] = [
  {
    id: '1',
    name: 'First Habit',
    description: 'Created your first habit',
    icon: '🏆',
    unlocked: false,
    color: '#9b87f5'
  },
  {
    id: '2',
    name: '3-Day Streak',
    description: 'Maintained a habit for 3 days in a row',
    icon: '🔥',
    unlocked: false,
    color: '#f97316'
  },
  {
    id: '3',
    name: '7-Day Streak',
    description: 'Maintained a habit for a week straight',
    icon: '⚡',
    unlocked: false,
    color: '#fbbf24'
  }
];

const defaultProfile: UserProfile = {
  username: 'User',
  level: 1,
  experience: 0,
  badges: defaultBadges
};

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'streak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: uuidv4(),
      completedDates: [],
      createdAt: new Date().toISOString(),
      streak: 0
    };

    setHabits(prev => [...prev, newHabit]);
    toast.success('Habit created successfully!');

    // Check for first habit badge
    if (habits.length === 0) {
      unlockBadge('1');
    }
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast.info('Habit removed');
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(prev => 
      prev.map(habit => habit.id === updatedHabit.id ? updatedHabit : habit)
    );
    toast.success('Habit updated successfully!');
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;
    
    // Sort dates from newest to oldest
    const sortedDates = [...completedDates].sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const toggleHabitCompletion = (id: string, date: string) => {
    setHabits(prev => {
      return prev.map(habit => {
        if (habit.id === id) {
          const isCompleted = habit.completedDates.includes(date);
          let newCompletedDates;
          
          if (isCompleted) {
            newCompletedDates = habit.completedDates.filter(d => d !== date);
            toast.info('Habit marked as incomplete');
          } else {
            newCompletedDates = [...habit.completedDates, date];
            addExperience(10);
            toast.success('Great job! +10 XP', {
              icon: "🎉"
            });
          }
          
          const newStreak = calculateStreak(newCompletedDates);
          
          // Check for streak badges
          if (newStreak >= 3 && !userProfile.badges.find(b => b.id === '2')?.unlocked) {
            unlockBadge('2');
          }
          
          if (newStreak >= 7 && !userProfile.badges.find(b => b.id === '3')?.unlocked) {
            unlockBadge('3');
          }
          
          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak
          };
        }
        return habit;
      });
    });
  };

  const checkHabitCompletion = (id: string, date: string): boolean => {
    const habit = habits.find(h => h.id === id);
    return habit ? habit.completedDates.includes(date) : false;
  };

  const addExperience = (amount: number) => {
    setUserProfile(prev => {
      const newExperience = prev.experience + amount;
      const experienceToLevelUp = prev.level * 100;
      
      if (newExperience >= experienceToLevelUp) {
        toast.success(`Level Up! You're now level ${prev.level + 1}`, {
          icon: "🌟",
          duration: 5000
        });
        
        return {
          ...prev,
          level: prev.level + 1,
          experience: newExperience - experienceToLevelUp
        };
      }
      
      return {
        ...prev,
        experience: newExperience
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setUserProfile(prev => {
      const updatedBadges = prev.badges.map(badge => 
        badge.id === badgeId ? { ...badge, unlocked: true } : badge
      );
      
      const badgeName = prev.badges.find(b => b.id === badgeId)?.name;
      
      if (badgeName) {
        toast.success(`Badge Unlocked: ${badgeName}`, {
          icon: "🏆",
          duration: 5000
        });
      }
      
      return {
        ...prev,
        badges: updatedBadges
      };
    });
    
    addExperience(50); // Award XP for badge unlock
  };

  return (
    <HabitContext.Provider 
      value={{ 
        habits, 
        userProfile,
        addHabit, 
        removeHabit, 
        updateHabit, 
        toggleHabitCompletion,
        checkHabitCompletion
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
