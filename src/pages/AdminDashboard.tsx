import React, { useMemo } from 'react';
import { getEmployees, getAttempts, getQuizzes, getPredictions } from '../utils/storage';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface AdminDashboardProps {
  onNavigate: (page: Page, params?: { quizId?: string; attemptId?: string }) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const employees = useMemo(() => getEmployees().filter((e) => e.role === 'employee'), []);
  const attempts = useMemo(() => getAttempts(), []);
  const quizzes = useMemo(() => getQuizzes(), []);
  const predictions = useMemo(() => getPredictions(), []);

  // Calculate stats
  const totalEmployees = employees.length;
  const totalAssessments = attempts.length;
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;
  const totalQuizzes = quizzes.length;

  // Prediction distribution
  const predictionDist = predictions.reduce((acc, p) => {
    acc[p.performanceCategory] = (acc[p.performanceCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity
  const recentAttempts = [...attempts].sort((a, b) => 
    new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  ).slice(0, 10);

  // Top performers
  const employeeScores = employees.map((emp) => {
    const empAttempts = attempts.filter((a) => a.employeeId === emp.id);
    const avgScore = empAttempts.length > 0
      ? Math.round(empAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / empAttempts.length)
      : 0;
    return { ...emp, avgScore, totalAttempts: empAttempts.length };
  }).sort((a, b) => b.avgScore - a.avgScore).slice(0, 5);

  // Quiz performance
  const quizStats = quizzes.map((quiz) => {
    const quizAttempts = attempts.filter((a) => a.quizId === quiz.id);
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / quizAttempts.length)
      : 0;
    return { ...quiz, attempts: quizAttempts.length, avgScore };
  });

  const getEmployeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    return emp?.name || 'Unknown';
  };

  const getQuizTitle = (id: string) => {
    const quiz = quizzes.find((q) => q.id === id);
    return quiz?.title || 'Unknown Quiz';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 📊</h1>
        <p className="text-gray-500 mt-1">Overview of organization-wide assessment performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
          <p className="text-sm text-gray-500 mt-1">Total Employees</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
          <p className="text-sm text-gray-500 mt-1">Active Quizzes</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalAssessments}</p>
          <p className="text-sm text-gray-500 mt-1">Total Assessments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
          <p className="text-sm text-gray-500 mt-1">Average Score</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Prediction Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Distribution (AI)</h3>
          <div className="space-y-4">
            {['High Performer', 'Average Performer', 'Needs Improvement'].map((cat) => {
              const count = predictionDist[cat] || 0;
              const total = predictions.length || 1;
              const pct = Math.round((count / total) * 100);
              const colors: Record<string, { bar: string; bg: string; text: string }> = {
                'High Performer': { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                'Average Performer': { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
                'Needs Improvement': { bar: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
              };
              const c = colors[cat];
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${c.text}`}>{cat}</span>
                    <span className="text-sm text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className={`${c.bar} h-3 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {predictions.length === 0 && (
              <p className="text-center text-gray-400 py-4">No predictions yet</p>
            )}
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quiz Performance Overview</h3>
          {quizStats.length > 0 ? (
            <div className="space-y-3">
              {quizStats.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{quiz.title}</p>
                    <p className="text-xs text-gray-500">{quiz.attempts} attempts</p>
                  </div>
                  <div className="ml-4">
                    <span className={`text-sm font-bold ${quiz.avgScore >= 80 ? 'text-emerald-600' : quiz.avgScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {quiz.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No quiz data available</p>
          )}
        </div>
      </div>

      {/* Top Performers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Performers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          {employeeScores.length > 0 ? (
            <div className="space-y-3">
              {employeeScores.map((emp, idx) => (
                <div key={emp.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.department} • {emp.totalAttempts} attempts</p>
                  </div>
                  <span className={`text-lg font-bold ${emp.avgScore >= 80 ? 'text-emerald-600' : emp.avgScore >= 60 ? 'text-amber-600' : 'text-gray-600'}`}>
                    {emp.avgScore}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No employee data yet</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          {recentAttempts.length > 0 ? (
            <div className="space-y-3">
              {recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{getEmployeeName(attempt.employeeId)}</p>
                    <p className="text-xs text-gray-500 truncate">{getQuizTitle(attempt.quizId)}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-gray-900">{Math.round((attempt.score / attempt.totalQuestions) * 100)}%</p>
                    <p className="text-xs text-gray-400">{new Date(attempt.endTime).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">No activity yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('create-quiz')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl text-left hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="font-semibold">Create New Quiz</p>
          <p className="text-indigo-200 text-sm mt-1">Add a new assessment</p>
        </button>

        <button
          onClick={() => onNavigate('manage-quiz')}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-2xl text-left hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
        >
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="font-semibold">Manage Quizzes</p>
          <p className="text-emerald-200 text-sm mt-1">Edit or delete quizzes</p>
        </button>

        <button
          onClick={() => onNavigate('ml-insights')}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-2xl text-left hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
        >
          <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="font-semibold">ML Insights</p>
          <p className="text-amber-200 text-sm mt-1">View model performance</p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
