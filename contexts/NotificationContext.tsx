
import React, { createContext, useReducer, ReactNode } from 'react';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationState {
  notifications: Notification[];
  count: number;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: number } };

const initialState: NotificationState = {
  notifications: [],
  count: 0,
};

let nextId = 1;

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotifications = [...state.notifications, { ...action.payload, id: nextId++ }];
      return {
        ...state,
        notifications: newNotifications,
        count: newNotifications.length,
      };
    case 'REMOVE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload.id);
      return {
        ...state,
        notifications: filteredNotifications,
        count: filteredNotifications.length,
      };
    default:
      return state;
  }
};

interface NotificationContextProps {
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
}

export const NotificationContext = createContext<NotificationContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};