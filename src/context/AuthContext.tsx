import  { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ADMIN_CREDENTIALS } from '../utils/constants';
import { AuthState, User } from '../types';

interface AuthContextType {
  auth: AuthState;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUserPassword: (username: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Check if there's existing auth data in localStorage
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth 
      ? JSON.parse(storedAuth) 
      : { isAuthenticated: false, username: null, role: null, club: null };
  });

  // Initialize users from ADMIN_CREDENTIALS
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers 
      ? JSON.parse(storedUsers) 
      : ADMIN_CREDENTIALS.map(cred => ({
          username: cred.username,
          password: cred.password,
          role: cred.role,
          club: cred.club || null
        }));
  });

  // Update localStorage when auth changes
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  // Update localStorage when users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = (username: string, password: string): boolean => {
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setAuth({
        isAuthenticated: true,
        username: user.username,
        role: user.role,
        club: user.club
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      username: null,
      role: null,
      club: null
    });
  };

  const updateUserPassword = (username: string, newPassword: string): boolean => {
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex === -1) return false;
    
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };
    
    setUsers(updatedUsers);
    return true;
  };

  const value = { auth, users, setUsers, login, logout, updateUserPassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 