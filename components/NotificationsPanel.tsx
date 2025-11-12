import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { XIcon, BellIcon, CheckCircleIcon, XCircleIcon, InfoIcon } from './icons';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useNotifications();

  useEffect(() => {
    if (state.notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id: state.notifications[0].id } });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notifications, dispatch]);

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch(type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'info': return <InfoIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card-light dark:bg-card-dark shadow-xl z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700">
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {state.notifications.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
              <BellIcon className="w-16 h-16 mb-4"/>
              <p>You have no new notifications.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-2">
              {state.notifications.map(notif => (
                <div key={notif.id} className="flex items-start space-x-3 p-3 rounded-lg mb-2 bg-background-light dark:bg-background-dark">
                    <div className="flex-shrink-0">{getIcon(notif.type)}</div>
                    <div className="flex-grow text-sm">{notif.message}</div>
                     <button onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id: notif.id } })} className="p-1 text-gray-400 hover:text-gray-600">
                        <XIcon className="w-4 h-4"/>
                    </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;