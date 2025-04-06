import { v4 as uuidv4 } from 'uuid';

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function addNotification(message: string): void {
  try {
    // Get existing notifications
    const savedNotifications = localStorage.getItem('notifications');
    const notifications: Notification[] = savedNotifications 
      ? JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
      : [];
    
    // Add new notification
    const newNotification: Notification = {
      id: uuidv4(),
      message,
      timestamp: new Date(),
      read: false
    };
    
    // Save updated notifications
    localStorage.setItem('notifications', JSON.stringify([newNotification, ...notifications]));
    
    // Dispatch a custom event to notify components that a new notification was added
    window.dispatchEvent(new CustomEvent('notificationAdded', { detail: newNotification }));
    
    console.log('Notification added:', newNotification);
  } catch (error) {
    console.error('Error adding notification:', error);
  }
} 