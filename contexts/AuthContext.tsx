import React, { createContext, useState, ReactNode } from 'react';

// Only farmer role is needed now
type UserRole = 'farmer';

interface AuthState {
  user: { role: UserRole } | null;
  // The login function is simpler, it always logs in a farmer.
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);

  // No need to pass a role anymore
  const login = () => {
    setUser({ role: 'farmer' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
