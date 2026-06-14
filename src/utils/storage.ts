// Local Storage utility - Simulates MySQL database for frontend demo
// In production, this would connect to Flask backend APIs

import { Employee, Quiz, Question, QuizAttempt, Prediction, Feedback } from '../types';

const STORAGE_KEYS = {
  EMPLOYEES: 'eap_employees',
  QUIZZES: 'eap_quizzes',
  QUESTIONS: 'eap_questions',
  ATTEMPTS: 'eap_attempts',
  PREDICTIONS: 'eap_predictions',
  FEEDBACKS: 'eap_feedbacks',
  CURRENT_USER: 'eap_current_user',
};

// Initialize default data
const initializeData = () => {
  // Default admin
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    const defaultEmployees: Employee[] = [
      {
        id: 'admin-001',
        employeeId: 'ADM001',
        name: 'System Administrator',
        email: 'admin@company.com',
        password: 'admin123',
        department: 'IT Administration',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(defaultEmployees));
  }

  // Sample quizzes with questions
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    const sampleQuizzes: Quiz[] = [
      {
        id: 'quiz-001',
        title: 'JavaScript Fundamentals',
        category: 'Technical',
        description: 'Test your knowledge of JavaScript basics, ES6 features, and DOM manipulation.',
        duration: 30,
        totalQuestions: 5,
        difficulty: 'Medium',
        createdBy: 'admin-001',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'quiz-002',
        title: 'Python Programming Basics',
        category: 'Technical',
        description: 'Fundamental Python concepts including data types, functions, and OOP.',
        duration: 25,
        totalQuestions: 5,
        difficulty: 'Easy',
        createdBy: 'admin-001',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'quiz-003',
        title: 'Data Structures & Algorithms',
        category: 'Technical',
        description: 'Advanced DSA concepts including trees, graphs, and algorithmic complexity.',
        duration: 45,
        totalQuestions: 5,
        difficulty: 'Hard',
        createdBy: 'admin-001',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'quiz-004',
        title: 'Communication Skills',
        category: 'Soft Skills',
        description: 'Assess your verbal and written communication abilities.',
        duration: 20,
        totalQuestions: 5,
        difficulty: 'Easy',
        createdBy: 'admin-001',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'quiz-005',
        title: 'Project Management',
        category: 'Management',
        description: 'Evaluate your understanding of project planning and agile methodologies.',
        duration: 35,
        totalQuestions: 5,
        difficulty: 'Medium',
        createdBy: 'admin-001',
        createdAt: new Date().toISOString(),
        isActive: true,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(sampleQuizzes));
  }

  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    const sampleQuestions: Question[] = [
      // JavaScript Questions
      { id: 'q-001', quizId: 'quiz-001', question: 'What is the output of typeof null in JavaScript?', optionA: '"null"', optionB: '"undefined"', optionC: '"object"', optionD: '"boolean"', correctAnswer: 'C' },
      { id: 'q-002', quizId: 'quiz-001', question: 'Which method is used to add an element at the end of an array?', optionA: 'push()', optionB: 'pop()', optionC: 'shift()', optionD: 'unshift()', correctAnswer: 'A' },
      { id: 'q-003', quizId: 'quiz-001', question: 'What does === operator check?', optionA: 'Value only', optionB: 'Type only', optionC: 'Value and Type', optionD: 'Reference', correctAnswer: 'C' },
      { id: 'q-004', quizId: 'quiz-001', question: 'Which keyword is used to declare a constant in JavaScript?', optionA: 'var', optionB: 'let', optionC: 'const', optionD: 'static', correctAnswer: 'C' },
      { id: 'q-005', quizId: 'quiz-001', question: 'What is a closure in JavaScript?', optionA: 'A function with no return', optionB: 'A function that has access to outer scope', optionC: 'A closed loop', optionD: 'A private variable', correctAnswer: 'B' },

      // Python Questions
      { id: 'q-006', quizId: 'quiz-002', question: 'What is the output of print(type([]))?', optionA: '<class list>', optionB: '<class array>', optionC: '<class tuple>', optionD: '<class dict>', correctAnswer: 'A' },
      { id: 'q-007', quizId: 'quiz-002', question: 'Which keyword is used to define a function in Python?', optionA: 'function', optionB: 'func', optionC: 'def', optionD: 'define', correctAnswer: 'C' },
      { id: 'q-008', quizId: 'quiz-002', question: 'What is the output of 3 ** 2 in Python?', optionA: '6', optionB: '9', optionC: '5', optionD: '1', correctAnswer: 'B' },
      { id: 'q-009', quizId: 'quiz-002', question: 'Which of these is NOT a valid Python data type?', optionA: 'list', optionB: 'dict', optionC: 'array', optionD: 'tuple', correctAnswer: 'C' },
      { id: 'q-010', quizId: 'quiz-002', question: 'How do you start a comment in Python?', optionA: '//', optionB: '/*', optionC: '#', optionD: '--', correctAnswer: 'C' },

      // DSA Questions
      { id: 'q-011', quizId: 'quiz-003', question: 'What is the time complexity of binary search?', optionA: 'O(n)', optionB: 'O(n^2)', optionC: 'O(log n)', optionD: 'O(1)', correctAnswer: 'C' },
      { id: 'q-012', quizId: 'quiz-003', question: 'Which data structure uses FIFO?', optionA: 'Stack', optionB: 'Queue', optionC: 'Tree', optionD: 'Graph', correctAnswer: 'B' },
      { id: 'q-013', quizId: 'quiz-003', question: 'What is the worst case time complexity of QuickSort?', optionA: 'O(n)', optionB: 'O(n log n)', optionC: 'O(n^2)', optionD: 'O(log n)', correctAnswer: 'C' },
      { id: 'q-014', quizId: 'quiz-003', question: 'Which traversal visits root first?', optionA: 'Inorder', optionB: 'Preorder', optionC: 'Postorder', optionD: 'Level order', correctAnswer: 'B' },
      { id: 'q-015', quizId: 'quiz-003', question: 'What is the space complexity of a recursive Fibonacci?', optionA: 'O(1)', optionB: 'O(n)', optionC: 'O(n^2)', optionD: 'O(2^n)', correctAnswer: 'B' },

      // Communication Skills
      { id: 'q-016', quizId: 'quiz-004', question: 'Active listening involves:', optionA: 'Interrupting to share ideas', optionB: 'Fully concentrating on the speaker', optionC: 'Thinking about your response', optionD: 'Checking your phone', correctAnswer: 'B' },
      { id: 'q-017', quizId: 'quiz-004', question: 'Which is the most effective communication channel for complex issues?', optionA: 'Email', optionB: 'Phone call', optionC: 'Face-to-face meeting', optionD: 'Text message', correctAnswer: 'C' },
      { id: 'q-018', quizId: 'quiz-004', question: 'Non-verbal communication accounts for what percentage of meaning?', optionA: '10%', optionB: '30%', optionC: '55%', optionD: '90%', correctAnswer: 'C' },
      { id: 'q-019', quizId: 'quiz-004', question: 'Constructive feedback should be:', optionA: 'Vague and general', optionB: 'Specific and actionable', optionC: 'Critical only', optionD: 'Avoided', correctAnswer: 'B' },
      { id: 'q-020', quizId: 'quiz-004', question: 'The best way to handle workplace conflict is:', optionA: 'Ignore it', optionB: 'Address it directly and professionally', optionC: 'Gossip about it', optionD: 'Report to HR immediately', correctAnswer: 'B' },

      // Project Management
      { id: 'q-021', quizId: 'quiz-005', question: 'What does the acronym SMART stand for in goal setting?', optionA: 'Simple, Measurable, Achievable, Realistic, Timely', optionB: 'Specific, Measurable, Achievable, Relevant, Time-bound', optionC: 'Smart, Modern, Actionable, Reliable, Tested', optionD: 'Strategic, Meaningful, Accurate, Rapid, Thorough', correctAnswer: 'B' },
      { id: 'q-022', quizId: 'quiz-005', question: 'In Agile methodology, what is a Sprint?', optionA: 'A quick meeting', optionB: 'A time-boxed iteration', optionC: 'A bug fix', optionD: 'A deployment', correctAnswer: 'B' },
      { id: 'q-023', quizId: 'quiz-005', question: 'What is the critical path in project management?', optionA: 'The shortest path', optionB: 'The most expensive path', optionC: 'The longest sequence of dependent tasks', optionD: 'The easiest path', correctAnswer: 'C' },
      { id: 'q-024', quizId: 'quiz-005', question: 'RACI matrix stands for:', optionA: 'Responsible, Accountable, Consulted, Informed', optionB: 'Ready, Active, Complete, Invoiced', optionC: 'Resource, Action, Control, Implement', optionD: 'Review, Approve, Create, Initiate', correctAnswer: 'A' },
      { id: 'q-025', quizId: 'quiz-005', question: 'Which is NOT a project management methodology?', optionA: 'Agile', optionB: 'Waterfall', optionC: 'Scrum', optionD: 'Compilation', correctAnswer: 'D' },
    ];
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(sampleQuestions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PREDICTIONS)) {
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACKS)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify([]));
  }
};

// Generic CRUD operations
const getItems = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setItems = <T>(key: string, items: T[]) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Employee operations
export const getEmployees = (): Employee[] => getItems(STORAGE_KEYS.EMPLOYEES);
export const addEmployee = (employee: Employee): void => {
  const employees = getEmployees();
  employees.push(employee);
  setItems(STORAGE_KEYS.EMPLOYEES, employees);
};
export const findEmployeeByEmail = (email: string): Employee | undefined => {
  return getEmployees().find((e) => e.email === email);
};
export const findEmployeeById = (id: string): Employee | undefined => {
  return getEmployees().find((e) => e.id === id);
};

// Quiz operations
export const getQuizzes = (): Quiz[] => getItems(STORAGE_KEYS.QUIZZES);
export const addQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  setItems(STORAGE_KEYS.QUIZZES, quizzes);
};
export const updateQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes().map((q) => (q.id === quiz.id ? quiz : q));
  setItems(STORAGE_KEYS.QUIZZES, quizzes);
};
export const deleteQuiz = (id: string): void => {
  const quizzes = getQuizzes().filter((q) => q.id !== id);
  setItems(STORAGE_KEYS.QUIZZES, quizzes);
  // Also delete related questions
  const questions = getQuestions().filter((q) => q.quizId !== id);
  setItems(STORAGE_KEYS.QUESTIONS, questions);
};
export const findQuizById = (id: string): Quiz | undefined => {
  return getQuizzes().find((q) => q.id === id);
};

// Question operations
export const getQuestions = (): Question[] => getItems(STORAGE_KEYS.QUESTIONS);
export const getQuestionsByQuizId = (quizId: string): Question[] => {
  return getQuestions().filter((q) => q.quizId === quizId);
};
export const addQuestion = (question: Question): void => {
  const questions = getQuestions();
  questions.push(question);
  setItems(STORAGE_KEYS.QUESTIONS, questions);
};
export const updateQuestion = (question: Question): void => {
  const questions = getQuestions().map((q) => (q.id === question.id ? question : q));
  setItems(STORAGE_KEYS.QUESTIONS, questions);
};
export const deleteQuestion = (id: string): void => {
  const questions = getQuestions().filter((q) => q.id !== id);
  setItems(STORAGE_KEYS.QUESTIONS, questions);
};

// Quiz Attempt operations
export const getAttempts = (): QuizAttempt[] => getItems(STORAGE_KEYS.ATTEMPTS);
export const getAttemptsByEmployee = (employeeId: string): QuizAttempt[] => {
  return getAttempts().filter((a) => a.employeeId === employeeId);
};
export const getAttemptsByQuiz = (quizId: string): QuizAttempt[] => {
  return getAttempts().filter((a) => a.quizId === quizId);
};
export const addAttempt = (attempt: QuizAttempt): void => {
  const attempts = getAttempts();
  attempts.push(attempt);
  setItems(STORAGE_KEYS.ATTEMPTS, attempts);
};
export const getAttemptCount = (employeeId: string, quizId: string): number => {
  return getAttempts().filter((a) => a.employeeId === employeeId && a.quizId === quizId).length;
};

// Prediction operations
export const getPredictions = (): Prediction[] => getItems(STORAGE_KEYS.PREDICTIONS);
export const getPredictionsByEmployee = (employeeId: string): Prediction[] => {
  return getPredictions().filter((p) => p.employeeId === employeeId);
};
export const addPrediction = (prediction: Prediction): void => {
  const predictions = getPredictions();
  predictions.push(prediction);
  setItems(STORAGE_KEYS.PREDICTIONS, predictions);
};

// Feedback operations
export const getFeedbacks = (): Feedback[] => getItems(STORAGE_KEYS.FEEDBACKS);
export const getFeedbacksByEmployee = (employeeId: string): Feedback[] => {
  return getFeedbacks().filter((f) => f.employeeId === employeeId);
};
export const addFeedback = (feedback: Feedback): void => {
  const feedbacks = getFeedbacks();
  feedbacks.push(feedback);
  setItems(STORAGE_KEYS.FEEDBACKS, feedbacks);
};

// Current user session
export const getCurrentUser = (): Employee | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};
export const setCurrentUser = (user: Employee | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Initialize on import
initializeData();
