import React from 'react';
import { useAuth } from '../context/AuthContext';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onToggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">AssessAI</h1>
                <p className="text-indigo-200 text-xs hidden sm:block">Employee Assessment Platform</p>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium leading-tight">{user?.name || 'User'}</p>
                <p className="text-indigo-200 text-xs">{isAdmin ? 'Administrator' : user?.department || 'Employee'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
