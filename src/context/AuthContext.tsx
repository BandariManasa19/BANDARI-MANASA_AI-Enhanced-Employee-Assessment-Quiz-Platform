import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee } from '../types';
import { getCurrentUser, setCurrentUser, findEmployeeByEmail, addEmployee, getEmployees } from '../utils/storage';

interface AuthContextType {
  user: Employee | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (employeeId: string, name: string, email: string, password: string, department: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employee = findEmployeeByEmail(email);
    if (!employee) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (employee.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    setUser(employee);
    setCurrentUser(employee);
    return { success: true };
  };

  const register = async (
    employeeId: string,
    name: string,
    email: string,
    password: string,
    department: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email already exists
    const existing = findEmployeeByEmail(email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Check if employee ID already exists
    const existingId = getEmployees().find((e) => e.employeeId === employeeId);
    if (existingId) {
      return { success: false, error: 'This Employee ID is already registered.' };
    }

    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      employeeId,
      name,
      email,
      password,
      department,
      role: 'employee',
      createdAt: new Date().toISOString(),
    };

    addEmployee(newEmployee);
    setUser(newEmployee);
    setCurrentUser(newEmployee);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
