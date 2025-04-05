
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Check, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { HabitForm } from './HabitForm';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const HabitList: React.FC = () => {
  const { habits, toggleHabitCompletion, removeHabit } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const handleDeleteHabit = (id: string) => {
    setHabitToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (habitToDelete) {
      removeHabit(habitToDelete);
      setHabitToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsFormOpen(true);
  };
  
  // Generate confetti particles on habit completion
  const generateConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const colors = ['#9b87f5', '#7E69AB', '#4ade80', '#fbbf24', '#f87171'];
    
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      const size = Math.random() * 10 + 5;
      const rColor = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = rColor;
      confetti.style.left = `${e.clientX - size/2}px`;
      confetti.style.top = `${e.clientY - size/2}px`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg) translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px)`;
      confetti.style.animationDelay = `${Math.random() * 0.2}s`;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 2000);
    }
  };
  
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <Button onClick={() => { setSelectedHabit(null); setIsFormOpen(true); }}>
          Add Habit
        </Button>
      </div>
      
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground text-center mb-4">
            You haven't created any habits yet. Start building better habits today!
          </p>
          <Button onClick={() => { setSelectedHabit(null); setIsFormOpen(true); }}>
            Create your first habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(todayStr);
            
            return (
              <div 
                key={habit.id} 
                className={`habit-card ${isCompletedToday ? 'habit-card-active' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="flex items-center justify-center w-10 h-10 rounded-full text-white"
                      style={{ backgroundColor: habit.color }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleEditHabit(habit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="habit-streak">
                    🔥 {habit.streak} day streak
                  </div>
                  
                  <Button
                    variant={isCompletedToday ? "outline" : "default"}
                    size="sm"
                    className={`transition-all ${isCompletedToday ? 'bg-green-100 dark:bg-green-900/20 hover:bg-green-200' : ''}`}
                    onClick={(e) => {
                      toggleHabitCompletion(habit.id, todayStr);
                      if (!isCompletedToday) {
                        generateConfetti(e);
                      }
                    }}
                  >
                    {isCompletedToday ? (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        Completed
                      </>
                    ) : 'Complete'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedHabit ? 'Edit Habit' : 'Create New Habit'}
            </DialogTitle>
          </DialogHeader>
          <HabitForm 
            initialValues={selectedHabit || undefined} 
            onClose={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all of its tracking data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
