import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAttempts, getPredictions, getFeedbacks, findQuizById, getQuestionsByQuizId } from '../utils/storage';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface ResultPageProps {
  attemptId: string;
  onNavigate: (page: Page, params?: { quizId?: string; attemptId?: string }) => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ attemptId, onNavigate }) => {
  const { user } = useAuth();
  const attempts = useMemo(() => getAttempts(), []);
  const predictions = useMemo(() => getPredictions(), []);
  const feedbacks = useMemo(() => getFeedbacks(), []);

  const attempt = attempts.find((a) => a.id === attemptId);
  const prediction = predictions.find((p) => p.attemptId === attemptId);
  const feedback = feedbacks.find((f) => f.attemptId === attemptId);
  const quiz = attempt ? findQuizById(attempt.quizId) : null;
  const questions = attempt ? getQuestionsByQuizId(attempt.quizId) : [];

  if (!attempt || !quiz) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Result Not Found</h2>
          <p className="text-gray-500 mb-6">The assessment result you're looking for doesn't exist.</p>
          <button
            onClick={() => onNavigate(user?.role === 'admin' ? 'admin-dashboard' : 'employee-dashboard')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scorePercent = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const minutes = Math.floor(attempt.timeTaken / 60);
  const seconds = attempt.timeTaken % 60;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate(user?.role === 'admin' ? 'admin-dashboard' : 'employee-dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Assessment Results</h1>
        <p className="text-gray-500 mt-1">{quiz.title} • {quiz.category}</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <div className="text-center">
          {/* Circular Score */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#f3f4f6" strokeWidth="12" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(scorePercent / 100) * 440} 440`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={scorePercent >= 80 ? '#10b981' : scorePercent >= 60 ? '#f59e0b' : '#ef4444'} />
                  <stop offset="100%" stopColor={scorePercent >= 80 ? '#059669' : scorePercent >= 60 ? '#d97706' : '#dc2626'} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-center">
              <p className={`text-4xl font-bold ${getScoreColor(scorePercent)}`}>{scorePercent}%</p>
              <p className="text-sm text-gray-500">Grade: {getGrade(scorePercent)}</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {attempt.score}/{attempt.totalQuestions} Correct
          </h2>
          <p className="text-gray-500">
            {scorePercent >= 80 ? '🎉 Excellent work!' : scorePercent >= 60 ? '👍 Good effort!' : '💪 Keep practicing!'}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attempt.accuracy}%</p>
          <p className="text-xs text-gray-500 mt-1">Accuracy</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{minutes}:{seconds.toString().padStart(2, '0')}</p>
          <p className="text-xs text-gray-500 mt-1">Time Taken</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attempt.attemptNumber}</p>
          <p className="text-xs text-gray-500 mt-1">Attempt #</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">
              {prediction?.performanceCategory === 'High Performer' ? '🏆' : 
               prediction?.performanceCategory === 'Average Performer' ? '📊' : '📈'}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900">{prediction?.performanceCategory || 'N/A'}</p>
          <p className="text-xs text-gray-500 mt-1">AI Prediction</p>
        </div>
      </div>

      {/* AI Prediction Detail */}
      {prediction && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold">AI Performance Analysis</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-indigo-200 text-xs">Category</p>
              <p className="font-bold text-lg">{prediction.performanceCategory}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-indigo-200 text-xs">Confidence</p>
              <p className="font-bold text-lg">{Math.round(prediction.confidence * 100)}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-indigo-200 text-xs">Model</p>
              <p className="font-bold text-lg">Random Forest</p>
            </div>
          </div>

          <p className="text-indigo-100 text-sm">
            Based on your score, accuracy, time efficiency, attempt history, and previous performance, 
            our Random Forest ML model has classified you as a <strong>{prediction.performanceCategory}</strong> with 
            {' '}{Math.round(prediction.confidence * 100)}% confidence.
          </p>
        </div>
      )}

      {/* AI Feedback */}
      {feedback && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI-Generated Feedback</h3>
              <p className="text-sm text-gray-500">Powered by Gemini AI with prompt engineering</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{feedback.content}</p>
        </div>
      )}

      {/* Question Review */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const answer = attempt.answers.find((a) => a.questionId === q.id);
            const isCorrect = answer?.isCorrect || false;
            const selected = answer?.selectedAnswer || 'Not answered';

            return (
              <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-2">{idx + 1}. {q.question}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                        Your answer: <strong className={isCorrect ? 'text-green-700' : 'text-red-700'}>{selected}</strong>
                      </span>
                      {!isCorrect && (
                        <span className="px-2 py-1 bg-green-100 rounded text-green-700">
                          Correct: <strong>{q.correctAnswer}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => onNavigate('quiz', { quizId: attempt.quizId })}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Retake Quiz
        </button>
        <button
          onClick={() => onNavigate(user?.role === 'admin' ? 'admin-dashboard' : 'employee-dashboard')}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
