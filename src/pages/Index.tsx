
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HabitProvider } from '@/contexts/HabitContext';
import { HabitList } from '@/components/HabitList';
import { Dashboard } from '@/components/Dashboard';
import { ProfileCard } from '@/components/ProfileCard';
import { Toaster } from '@/components/ui/sonner';
import { useUser } from "@clerk/clerk-react";


const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, isSignedIn } = useUser();

  
  return (
    <HabitProvider>
      <div className="min-h-screen flex flex-col bg-habit-background">
        <div className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            <aside className="space-y-6">
              <ProfileCard />
              
              <Tabs 
                defaultValue="dashboard" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="habits">Habits</TabsTrigger>
                </TabsList>
              </Tabs>
            </aside>
            
            <main>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'habits' && <HabitList />}
            </main>
          </div>
        </div>
      </div>
      <Toaster />
    </HabitProvider>
  );
};

export default Index;
