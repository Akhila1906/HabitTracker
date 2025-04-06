import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from 'uuid';
import { Notification } from "@/utils/notifications";

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        // If there's an error parsing, start fresh
        localStorage.removeItem('notifications');
        addTestNotification();
      }
    } else {
      // Add a test notification if none exist
      addTestNotification();
    }
  }, []);

  // Listen for new notifications
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      console.log("New notification received:", event.detail);
      setNotifications(prev => [event.detail, ...prev]);
    };

    window.addEventListener('notificationAdded', handleNewNotification as EventListener);
    
    return () => {
      window.removeEventListener('notificationAdded', handleNewNotification as EventListener);
    };
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addTestNotification = () => {
    const testNotification: Notification = {
      id: uuidv4(),
      message: "Welcome to ReFrame! This is a test notification.",
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [testNotification, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={`flex flex-col items-start p-4 ${!notification.read ? 'bg-muted/50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.message}</span>
                  {!notification.read && (
                    <Badge variant="secondary" className="ml-2">New</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {notification.timestamp.toLocaleString()}
                </span>
              </DropdownMenuItem>
            ))}
            {unreadCount > 0 && (
              <DropdownMenuItem 
                className="text-center font-medium"
                onClick={markAllAsRead}
              >
                Mark all as read
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 