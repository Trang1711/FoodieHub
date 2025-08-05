import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 