
import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check localStorage for persistent login
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserType = localStorage.getItem('userType');
    setIsAuthenticated(loggedIn);
    setUserType(storedUserType);
  }, []);

  const login = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
