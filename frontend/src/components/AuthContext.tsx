import React from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});