import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell,
  X,
  CheckCircle,
  Info,
  AlertTriangle,
  Zap,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'analysis';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Analysis Complete!',
        message: 'Your hair analysis has been processed successfully.',
        timestamp: new Date(Date.now() - 300000), // 5 mins ago
        read: false
      },
      {
        id: '2',
        type: 'info',
        title: 'New AI Model Available',
        message: 'Gemini 2.5 Flash now offers 25% better accuracy.',
        timestamp: new Date(Date.now() - 900000), // 15 mins ago
        read: false
      },
      {
        id: '3',
        type: 'analysis',
        title: 'Progress Update',
        message: 'Your hair health has improved by 12% this month!',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: true
      }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'analysis': return TrendingUp;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'from-emerald-500 to-emerald-700';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'analysis': return 'from-purple-500 to-purple-700';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative glass-card backdrop-blur-sm hover:bg-white/10 animate-pulse-glow"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive"
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs animate-bounce"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className={`absolute top-12 right-0 w-80 max-h-96 overflow-hidden glass-card backdrop-blur-md border-white/20 shadow-2xl z-50 animate-slide-up`}>
          <CardContent className="p-0">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Notifications</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 p-0 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const IconComponent = getIcon(notification.type);
                  const colorClass = getColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        !notification.read ? 'bg-white/5' : ''
                      } animate-bounce-in`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gradient-to-r ${colorClass} flex-shrink-0`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-white truncate">
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1 ml-2">
                              <span className="text-xs text-gray-400">
                                {formatTime(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs h-6 px-2 hover:bg-white/10"
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                              className="text-xs h-6 px-2 text-red-400 hover:bg-red-500/10"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;