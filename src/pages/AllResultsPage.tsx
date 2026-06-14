import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAttempts, getAttemptsByEmployee, getPredictions, findQuizById, getEmployees } from '../utils/storage';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface AllResultsPageProps {
  onNavigate: (page: Page, params?: { attemptId?: string }) => void;
}

const AllResultsPage: React.FC<AllResultsPageProps> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  
  const attempts = useMemo(() => {
    if (isAdmin) return getAttempts();
    return getAttemptsByEmployee(user?.id || '');
  }, [user?.id, isAdmin]);

  const predictions = useMemo(() => getPredictions(), []);
  const employees = useMemo(() => getEmployees(), []);

  const sortedAttempts = useMemo(() => 
    [...attempts].sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()),
    [attempts]
  );

  const getQuizTitle = (quizId: string) => {
    return findQuizById(quizId)?.title || 'Unknown Quiz';
  };

  const getEmployeeName = (empId: string) => {
    return employees.find((e) => e.id === empId)?.name || 'Unknown';
  };

  const getPrediction = (attemptId: string) => {
    return predictions.find((p) => p.attemptId === attemptId);
  };

  const getPerformanceColor = (category: string) => {
    switch (category) {
      case 'High Performer': return 'bg-emerald-50 text-emerald-700';
      case 'Average Performer': return 'bg-amber-50 text-amber-700';
      case 'Needs Improvement': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  // Stats
  const totalAttempts = attempts.length;
  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;
  const avgAccuracy = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length)
    : 0;
  const highestScore = attempts.length > 0
    ? Math.max(...attempts.map((a) => Math.round((a.score / a.totalQuestions) * 100)))
    : 0;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAdmin ? 'All Assessment Results' : 'My Results'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isAdmin ? 'View all employee assessment results' : 'Track your assessment performance history'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
          <p className="text-sm text-gray-500">Total Attempts</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</p>
          <p className="text-sm text-gray-500">Average Score</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{avgAccuracy}%</p>
          <p className="text-sm text-gray-500">Average Accuracy</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className={`text-2xl font-bold ${getScoreColor(highestScore)}`}>{highestScore}%</p>
          <p className="text-sm text-gray-500">Highest Score</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {isAdmin && <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>}
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">AI Prediction</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedAttempts.map((attempt) => {
                const scorePct = Math.round((attempt.score / attempt.totalQuestions) * 100);
                const pred = getPrediction(attempt.id);
                const timeMin = Math.floor(attempt.timeTaken / 60);
                const timeSec = attempt.timeTaken % 60;

                return (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">
                              {getEmployeeName(attempt.employeeId).charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{getEmployeeName(attempt.employeeId)}</span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{getQuizTitle(attempt.quizId)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${getScoreColor(scorePct)}`}>
                        {attempt.score}/{attempt.totalQuestions} ({scorePct}%)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{attempt.accuracy}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">{timeMin}:{timeSec.toString().padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {pred ? (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPerformanceColor(pred.performanceCategory)}`}>
                          {pred.performanceCategory}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-500">
                        {new Date(attempt.endTime).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => onNavigate('result', { attemptId: attempt.id })}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedAttempts.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-500">{isAdmin ? 'Results will appear here as employees complete quizzes.' : 'Complete a quiz to see your results here.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllResultsPage;
