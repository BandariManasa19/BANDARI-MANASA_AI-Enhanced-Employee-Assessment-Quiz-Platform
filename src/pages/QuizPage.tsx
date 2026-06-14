import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { findQuizById, getQuestionsByQuizId, addAttempt, getAttemptCount, getAttemptsByEmployee, addPrediction, addFeedback } from '../utils/storage';
import { predictPerformance } from '../utils/ml';
import { generateFeedback } from '../utils/feedback';
import { QuizAttempt, Prediction, Feedback } from '../types';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface QuizPageProps {
  quizId: string;
  onNavigate: (page: Page, params?: { quizId?: string; attemptId?: string }) => void;
}

const QuizPage: React.FC<QuizPageProps> = ({ quizId, onNavigate }) => {
  const { user } = useAuth();
  const quiz = findQuizById(quizId);
  const questions = getQuestionsByQuizId(quizId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Initialize timer
  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || quizSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setQuizStarted(true);
    setStartTime(new Date());
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = useCallback(() => {
    if (submitting || quizSubmitted) return;
    setSubmitting(true);

    const endTime = new Date();
    const timeTaken = startTime ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) : (quiz?.duration || 0) * 60;

    // Calculate score
    let score = 0;
    const answerDetails = questions.map((q) => {
      const selected = answers[q.id] || '';
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return { questionId: q.id, selectedAnswer: selected, isCorrect };
    });

    const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const attemptCount = user ? getAttemptCount(user.id, quizId) + 1 : 1;

    // Get previous performance average
    const previousAttempts = user ? getAttemptsByEmployee(user.id) : [];
    const previousPerformance = previousAttempts.length > 0
      ? Math.round(previousAttempts.reduce((sum, a) => sum + a.accuracy, 0) / previousAttempts.length)
      : 0;

    // Create attempt record
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      employeeId: user?.id || '',
      quizId,
      startTime: startTime?.toISOString() || new Date().toISOString(),
      endTime: endTime.toISOString(),
      score,
      totalQuestions: questions.length,
      accuracy,
      timeTaken,
      attemptNumber: attemptCount,
      answers: answerDetails,
    };

    addAttempt(attempt);

    // ML Prediction
    const mlResult = predictPerformance({
      score,
      accuracy,
      timeTaken,
      attempts: attemptCount,
      previousPerformance,
      totalQuestions: questions.length,
      duration: quiz?.duration || 30,
    });

    const prediction: Prediction = {
      id: `pred-${Date.now()}`,
      attemptId: attempt.id,
      employeeId: user?.id || '',
      performanceCategory: mlResult.category,
      confidence: mlResult.confidence,
      features: {
        score,
        accuracy,
        timeTaken,
        attempts: attemptCount,
        previousPerformance,
      },
      createdAt: new Date().toISOString(),
    };

    addPrediction(prediction);

    // Generate AI Feedback
    const feedbackText = generateFeedback({
      score,
      totalQuestions: questions.length,
      accuracy,
      timeTaken,
      performanceCategory: mlResult.category,
      previousPerformance,
      quizTitle: quiz?.title || 'Assessment',
      employeeName: user?.name || 'Employee',
    });

    const feedback: Feedback = {
      id: `fb-${Date.now()}`,
      attemptId: attempt.id,
      employeeId: user?.id || '',
      content: feedbackText,
      createdAt: new Date().toISOString(),
    };

    addFeedback(feedback);

    setQuizSubmitted(true);
    setSubmitting(false);

    // Navigate to result
    onNavigate('result', { attemptId: attempt.id });
  }, [submitting, quizSubmitted, startTime, questions, answers, quiz, user, quizId, onNavigate]);

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h2>
          <p className="text-gray-500 mb-6">This quiz doesn't exist or has no questions.</p>
          <button
            onClick={() => onNavigate('employee-dashboard')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
              {quiz.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              <p className="text-sm text-gray-500">Questions</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{quiz.duration}</p>
              <p className="text-sm text-gray-500">Minutes</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Each question has 4 options (A, B, C, D)</li>
              <li>• Select the best answer for each question</li>
              <li>• You can navigate between questions freely</li>
              <li>• The quiz auto-submits when time runs out</li>
              <li>• AI will analyze your performance after submission</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => onNavigate('employee-dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const isTimeWarning = timeLeft < 60;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">{quiz.title}</h2>
          <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${isTimeWarning ? 'bg-red-50 text-red-700' : 'bg-indigo-50 text-indigo-700'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm font-medium text-gray-700">{answeredCount}/{questions.length} answered</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
        <div className="mb-6">
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Question {currentQuestion + 1}
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mt-4">{currentQ.question}</h3>
        </div>

        <div className="space-y-3">
          {(['A', 'B', 'C', 'D'] as const).map((option) => {
            const optionText = option === 'A' ? currentQ.optionA : option === 'B' ? currentQ.optionB : option === 'C' ? currentQ.optionC : currentQ.optionD;
            const isSelected = answers[currentQ.id] === option;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(currentQ.id, option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 font-semibold text-sm ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {option}
                </span>
                <span className={`${isSelected ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                  {optionText}
                </span>
                {isSelected && (
                  <svg className="w-5 h-5 text-indigo-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Question dots */}
        <div className="hidden sm:flex items-center space-x-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-indigo-600 text-white'
                  : answers[q.id]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Next
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Submit Quiz
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
