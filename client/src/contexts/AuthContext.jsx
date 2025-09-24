import { createContext, useContext, useState } from 'react';
import { loginUser, logoutUser, getUserInfo } from '../API/API.mjs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const login = async (username, password) => {
    try {
      const userData = await loginUser(username, password);
      setIsAuthenticated(true);
      setUser(userData);
      return { user: userData, error: null };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      return { user: null, error: error.message};
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await getUserInfo();
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch (error) { // this error is unused because it's only important to not allow the user to still
                      // have the access of the pages as authenticated
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      return res;
    } catch (error) {
      return error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, checkAuth,logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}