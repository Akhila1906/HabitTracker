
export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // ISO date strings
  createdAt: string;
  streak: number;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  color: string;
}

export interface UserProfile {
  username: string;
  level: number;
  experience: number;
  badges: Badge[];
}
