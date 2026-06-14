// Type definitions for the Employee Assessment Platform

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  password: string;
  department: string;
  role: 'employee' | 'admin';
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizAttempt {
  id: string;
  employeeId: string;
  quizId: string;
  startTime: string;
  endTime: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number; // in seconds
  attemptNumber: number;
  answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[];
}

export interface Prediction {
  id: string;
  attemptId: string;
  employeeId: string;
  performanceCategory: 'High Performer' | 'Average Performer' | 'Needs Improvement';
  confidence: number;
  features: {
    score: number;
    accuracy: number;
    timeTaken: number;
    attempts: number;
    previousPerformance: number;
  };
  createdAt: string;
}

export interface Feedback {
  id: string;
  attemptId: string;
  employeeId: string;
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  totalAssessments: number;
  latestScore: number;
  averageAccuracy: number;
  performanceTrend: number[];
  quizHistory: QuizAttempt[];
}

export interface AdminStats {
  totalEmployees: number;
  totalAssessments: number;
  averageScores: number;
  topPerformers: Employee[];
  recentActivity: QuizAttempt[];
}
