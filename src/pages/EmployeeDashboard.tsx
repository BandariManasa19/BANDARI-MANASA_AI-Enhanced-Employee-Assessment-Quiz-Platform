import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getQuizzes, getAttemptsByEmployee, getPredictionsByEmployee, getFeedbacksByEmployee } from '../utils/storage';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface EmployeeDashboardProps {
  onNavigate: (page: Page, params?: { quizId?: string; attemptId?: string }) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const quizzes = getQuizzes().filter((q) => q.isActive);
  const attempts = useMemo(() => getAttemptsByEmployee(user?.id || ''), [user?.id]);
  const predictions = useMemo(() => getPredictionsByEmployee(user?.id || ''), [user?.id]);
  const feedbacks = useMemo(() => getFeedbacksByEmployee(user?.id || ''), [user?.id]);

  // Calculate stats
  const totalAssessments = attempts.length;
  const averageAccuracy = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / attempts.length)
    : 0;
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
    : 0;
  const latestPrediction = predictions.length > 0 ? predictions[predictions.length - 1] : null;

  // Performance trend (last 10 attempts)
  const trendData = attempts.slice(-10).map((a) => Math.round((a.score / a.totalQuestions) * 100));

  const getPredictionIcon = (category: string) => {
    switch (category) {
      case 'High Performer': return '🏆';
      case 'Average Performer': return '📊';
      case 'Needs Improvement': return '📈';
      default: return '📋';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here's your assessment overview and performance insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalAssessments}</p>
          <p className="text-sm text-gray-500 mt-1">Total Assessments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
          <p className="text-sm text-gray-500 mt-1">Average Score</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{averageAccuracy}%</p>
          <p className="text-sm text-gray-500 mt-1">Average Accuracy</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <span className="text-2xl">{latestPrediction ? getPredictionIcon(latestPrediction.performanceCategory) : '📊'}</span>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900">{latestPrediction?.performanceCategory || 'N/A'}</p>
          <p className="text-sm text-gray-500 mt-1">AI Prediction</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          {trendData.length > 0 ? (
            <div className="h-48 flex items-end space-x-2">
              {trendData.map((score, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${Math.max(score, 5)}%` }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{score}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p>Take a quiz to see your performance trend</p>
              </div>
            </div>
          )}
        </div>

        {/* AI Prediction Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold">AI Performance Insight</h3>
          </div>
          
          {latestPrediction ? (
            <div>
              <div className="text-4xl mb-2">{getPredictionIcon(latestPrediction.performanceCategory)}</div>
              <p className="text-2xl font-bold mb-2">{latestPrediction.performanceCategory}</p>
              <p className="text-indigo-100 text-sm mb-4">
                Confidence: {Math.round(latestPrediction.confidence * 100)}%
              </p>
              
              {/* Feature breakdown */}
              <div className="space-y-2">
                {Object.entries(latestPrediction.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-indigo-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{typeof value === 'number' ? Math.round(value) : value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-indigo-100 mb-4">Complete your first assessment to get AI-powered performance predictions.</p>
              <button
                onClick={() => quizzes.length > 0 && onNavigate('quiz', { quizId: quizzes[0].id })}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Take a Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Available Quizzes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Available Quizzes</h3>
          <span className="text-sm text-gray-500">{quizzes.length} quizzes</span>
        </div>
        
        {quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const attemptCount = attempts.filter((a) => a.quizId === quiz.id).length;
              const bestScore = attempts
                .filter((a) => a.quizId === quiz.id)
                .reduce((best, a) => Math.max(best, Math.round((a.score / a.totalQuestions) * 100)), 0);
              
              return (
                <div key={quiz.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                      {quiz.category}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.totalQuestions} Qs
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {quiz.duration} min
                    </span>
                  </div>

                  {attemptCount > 0 && (
                    <div className="flex items-center space-x-4 mb-4 text-xs">
                      <span className="text-gray-500">Attempts: <strong>{attemptCount}</strong></span>
                      <span className="text-gray-500">Best: <strong className="text-green-600">{bestScore}%</strong></span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => onNavigate('quiz', { quizId: quiz.id })}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all text-sm"
                  >
                    {attemptCount > 0 ? 'Retake Quiz' : 'Start Quiz'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">No quizzes available yet. Check back later!</p>
          </div>
        )}
      </div>

      {/* Recent AI Feedback */}
      {feedbacks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent AI Feedback</h3>
          <div className="space-y-3">
            {feedbacks.slice(-3).reverse().map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm leading-relaxed">{feedback.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
