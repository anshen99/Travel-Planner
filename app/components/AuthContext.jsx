"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Mock users for testing
const MOCK_USERS = [
  { 
    id: '1', 
    email: 'test@example.com', 
    password: 'password123', 
    name: 'Test User' 
  }
];

// Mock API functions
export const mockAPI = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      return { 
        success: true, 
        token: btoa(JSON.stringify({ userId: user.id, email: user.email })), 
        user: { id: user.id, name: user.name, email: user.email } 
      };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  register: async (name, email, password) => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    
    // Check if user already exists
    const exists = MOCK_USERS.some(u => u.email === email);
    if (exists) {
      return { success: false, message: 'User already exists' };
    }

    // Create new user
    const newUser = { id: String(MOCK_USERS.length + 1), email, password, name };
    MOCK_USERS.push(newUser);
    
    return { 
      success: true, 
      token: btoa(JSON.stringify({ userId: newUser.id, email: newUser.email })),
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    };
  },
  
  getCurrentUser: (token) => {
    try {
      const data = JSON.parse(atob(token));
      const user = MOCK_USERS.find(u => u.id === data.userId);
      if (user) {
        return { id: user.id, name: user.name, email: user.email };
      }
    } catch (e) {
      console.error('Invalid token');
    }
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = mockAPI.getCurrentUser(token);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await mockAPI.login(email, password);
    if (result.success) {
      localStorage.setItem("token", result.token);
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const register = async (name, email, password) => {
    const result = await mockAPI.register(name, email, password);
    if (result.success) {
      localStorage.setItem("token", result.token);
      setUser(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 