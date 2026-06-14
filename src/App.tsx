import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import CreateQuizPage from './pages/CreateQuizPage';
import ManageQuizPage from './pages/ManageQuizPage';
import AddQuestionPage from './pages/AddQuestionPage';
import AllResultsPage from './pages/AllResultsPage';
import MLInsightsPage from './pages/MLInsightsPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

type Page = 
  | 'login' 
  | 'admin-login'
  | 'register' 
  | 'admin-register'
  | 'employee-dashboard' 
  | 'admin-dashboard' 
  | 'quiz' 
  | 'result' 
  | 'create-quiz' 
  | 'manage-quiz'
  | 'add-question'
  | 'all-results'
  | 'ml-insights';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(
    isAuthenticated ? (isAdmin ? 'admin-dashboard' : 'employee-dashboard') : 'login'
  );
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (page: Page, params?: { quizId?: string; attemptId?: string }) => {
    setCurrentPage(page);
    if (params?.quizId) setSelectedQuizId(params.quizId);
    if (params?.attemptId) setSelectedAttemptId(params.attemptId);
    setSidebarOpen(false);
  };

  // Handle navigation after auth changes
  React.useEffect(() => {
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
      setCurrentPage(isAdmin ? 'admin-dashboard' : 'employee-dashboard');
    } else if (!isAuthenticated && currentPage !== 'login' && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, isAdmin]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'admin-login':
        return <AdminLoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'employee-dashboard':
        return <EmployeeDashboard onNavigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigate} />;
      case 'quiz':
        return <QuizPage quizId={selectedQuizId} onNavigate={navigate} />;
      case 'result':
        return <ResultPage attemptId={selectedAttemptId} onNavigate={navigate} />;
      case 'create-quiz':
        return <CreateQuizPage onNavigate={navigate} />;
      case 'manage-quiz':
        return <ManageQuizPage onNavigate={navigate} />;
      case 'add-question':
        return <AddQuestionPage quizId={selectedQuizId} onNavigate={navigate} />;
      case 'all-results':
        return <AllResultsPage onNavigate={navigate} />;
case 'ml-insights':
        return <MLInsightsPage onNavigate={navigate} />;
      case 'admin-register':
        return <AdminRegisterPage onNavigate={navigate} />;
      default:
        return <LoginPage onNavigate={navigate} />;
    }
  };
  
  const showSidebar = isAuthenticated && !['login', 'register', 'admin-login', 'admin-register'].includes(currentPage);
  const showNavbar = !['login', 'register', 'admin-login', 'admin-register'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && (
        <Navbar 
          onNavigate={navigate} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        />
      )}
      <div className="flex">
        {showSidebar && (
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={navigate} 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''} ${showNavbar ? 'pt-16' : ''}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
