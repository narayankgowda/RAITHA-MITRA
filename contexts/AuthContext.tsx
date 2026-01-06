
import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';

// Define the User type and Role
type UserRole = 'farmer' | 'admin' | 'buyer';

export interface User {
    id: string;
    username: string;
    password?: string; // Should not be stored in plain text in a real app
    role: UserRole;
    fullName?: string;
}

// Pre-populate with users
const initialUsers: User[] = [
    { id: 'admin-01', username: 'admin', password: 'password', role: 'admin', fullName: 'Admin User' },
    { id: 'buyer-01', username: 'buyer', password: 'password', role: 'buyer', fullName: 'Retail Buyer' }
];

// Define the shape of the context state
interface AuthState {
  user: Omit<User, 'password'> | null;
  signIn: (username: string, password: string) => Promise<{ success: boolean; message: string; role?: UserRole }>;
  signUp: (fullName: string, username: string, password: string, role?: UserRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthState>({
  user: null,
  signIn: async () => ({ success: false, message: 'Sign in function not ready.' }),
  signUp: async () => ({ success: false, message: 'Sign up function not ready.' }),
  logout: () => {},
});

// Create the provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(() => {
      try {
          const storedUser = localStorage.getItem('user');
          return storedUser ? JSON.parse(storedUser) : null;
      } catch {
          return null;
      }
  });
  const [users, setUsers] = useState<User[]>(initialUsers);

  const signIn = useCallback(async (username: string, password: string): Promise<{ success: boolean; message: string; role?: UserRole }> => {
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (foundUser) {
      // In a real app, you wouldn't store the password in the user state
      const { password: _, ...userToSet } = foundUser;
      setUser(userToSet);
      localStorage.setItem('user', JSON.stringify(userToSet));
      return { success: true, message: 'Login successful!', role: userToSet.role };
    }
    return { success: false, message: 'Invalid username or password.' };
  }, [users]);

  const signUp = useCallback(async (fullName: string, username: string, password: string, role: UserRole = 'farmer'): Promise<{ success: boolean; message: string }> => {
    const userExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) {
      return { success: false, message: 'Username is already taken.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password, // Again, don't store plain text passwords
      fullName,
      role
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    // Automatically sign in after sign up
    const { password: _, ...userToSet } = newUser;
    setUser(userToSet);
    localStorage.setItem('user', JSON.stringify(userToSet));
    return { success: true, message: 'Account created successfully!' };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
