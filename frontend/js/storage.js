// Local Storage Utility - Simulates MySQL database for frontend demo
// In production, this connects to Flask backend APIs

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
function initializeData() {
    // Default admin
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
        const defaultEmployees = [
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
        const sampleQuizzes = [
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
        const sampleQuestions = [
            // JavaScript Questions
            { id: 'q-001', quizId: 'quiz-001', question: 'What is the output of typeof null in JavaScript?', optionA: '"null"', optionB: '"undefined"', optionC: '"object"', optionD: '"boolean"', correctAnswer: 'C', difficulty: 'Easy' },
            { id: 'q-002', quizId: 'quiz-001', question: 'Which method is used to add an element at the end of an array?', optionA: 'push()', optionB: 'pop()', optionC: 'shift()', optionD: 'unshift()', correctAnswer: 'A', difficulty: 'Easy' },
            { id: 'q-003', quizId: 'quiz-001', question: 'What does === operator check?', optionA: 'Value only', optionB: 'Type only', optionC: 'Value and Type', optionD: 'Reference', correctAnswer: 'C', difficulty: 'Medium' },
            { id: 'q-004', quizId: 'quiz-001', question: 'Which keyword is used to declare a constant in JavaScript?', optionA: 'var', optionB: 'let', optionC: 'const', optionD: 'static', correctAnswer: 'C', difficulty: 'Easy' },
            { id: 'q-005', quizId: 'quiz-001', question: 'What is a closure in JavaScript?', optionA: 'A function with no return', optionB: 'A function that has access to outer scope', optionC: 'A closed loop', optionD: 'A private variable', correctAnswer: 'B', difficulty: 'Hard' },
            // Python Questions
            { id: 'q-006', quizId: 'quiz-002', question: 'What is the output of print(type([]))?', optionA: '<class list>', optionB: '<class array>', optionC: '<class tuple>', optionD: '<class dict>', correctAnswer: 'A', difficulty: 'Easy' },
            { id: 'q-007', quizId: 'quiz-002', question: 'Which keyword is used to define a function in Python?', optionA: 'function', optionB: 'func', optionC: 'def', optionD: 'define', correctAnswer: 'C', difficulty: 'Easy' },
            { id: 'q-008', quizId: 'quiz-002', question: 'What is the output of 3 ** 2 in Python?', optionA: '6', optionB: '9', optionC: '5', optionD: '1', correctAnswer: 'B', difficulty: 'Easy' },
            { id: 'q-009', quizId: 'quiz-002', question: 'Which of these is NOT a valid Python data type?', optionA: 'list', optionB: 'dict', optionC: 'array', optionD: 'tuple', correctAnswer: 'C', difficulty: 'Medium' },
            { id: 'q-010', quizId: 'quiz-002', question: 'How do you start a comment in Python?', optionA: '//', optionB: '/*', optionC: '#', optionD: '--', correctAnswer: 'C', difficulty: 'Easy' },
            // DSA Questions
            { id: 'q-011', quizId: 'quiz-003', question: 'What is the time complexity of binary search?', optionA: 'O(n)', optionB: 'O(n^2)', optionC: 'O(log n)', optionD: 'O(1)', correctAnswer: 'C', difficulty: 'Medium' },
            { id: 'q-012', quizId: 'quiz-003', question: 'Which data structure uses FIFO?', optionA: 'Stack', optionB: 'Queue', optionC: 'Tree', optionD: 'Graph', correctAnswer: 'B', difficulty: 'Easy' },
            { id: 'q-013', quizId: 'quiz-003', question: 'What is the worst case time complexity of QuickSort?', optionA: 'O(n)', optionB: 'O(n log n)', optionC: 'O(n^2)', optionD: 'O(log n)', correctAnswer: 'C', difficulty: 'Hard' },
            { id: 'q-014', quizId: 'quiz-003', question: 'Which traversal visits root first?', optionA: 'Inorder', optionB: 'Preorder', optionC: 'Postorder', optionD: 'Level order', correctAnswer: 'B', difficulty: 'Medium' },
            { id: 'q-015', quizId: 'quiz-003', question: 'What is the space complexity of a recursive Fibonacci?', optionA: 'O(1)', optionB: 'O(n)', optionC: 'O(n^2)', optionD: 'O(2^n)', correctAnswer: 'B', difficulty: 'Hard' },
            // Communication Questions
            { id: 'q-016', quizId: 'quiz-004', question: 'Active listening involves:', optionA: 'Interrupting to share ideas', optionB: 'Fully concentrating on the speaker', optionC: 'Thinking about your response', optionD: 'Checking your phone', correctAnswer: 'B', difficulty: 'Easy' },
            { id: 'q-017', quizId: 'quiz-004', question: 'Which is the most effective communication channel for complex issues?', optionA: 'Email', optionB: 'Phone call', optionC: 'Face-to-face meeting', optionD: 'Text message', correctAnswer: 'C', difficulty: 'Medium' },
            { id: 'q-018', quizId: 'quiz-004', question: 'Non-verbal communication accounts for what percentage of meaning?', optionA: '10%', optionB: '30%', optionC: '55%', optionD: '90%', correctAnswer: 'C', difficulty: 'Hard' },
            { id: 'q-019', quizId: 'quiz-004', question: 'Constructive feedback should be:', optionA: 'Vague and general', optionB: 'Specific and actionable', optionC: 'Critical only', optionD: 'Avoided', correctAnswer: 'B', difficulty: 'Medium' },
            { id: 'q-020', quizId: 'quiz-004', question: 'The best way to handle workplace conflict is:', optionA: 'Ignore it', optionB: 'Address it directly and professionally', optionC: 'Gossip about it', optionD: 'Report to HR immediately', correctAnswer: 'B', difficulty: 'Easy' },
            // Project Management Questions
            { id: 'q-021', quizId: 'quiz-005', question: 'What does SMART stand for in goal setting?', optionA: 'Simple, Measurable, Achievable, Realistic, Timely', optionB: 'Specific, Measurable, Achievable, Relevant, Time-bound', optionC: 'Smart, Modern, Actionable, Reliable, Tested', optionD: 'Strategic, Meaningful, Accurate, Rapid, Thorough', correctAnswer: 'B', difficulty: 'Medium' },
            { id: 'q-022', quizId: 'quiz-005', question: 'In Agile methodology, what is a Sprint?', optionA: 'A quick meeting', optionB: 'A time-boxed iteration', optionC: 'A bug fix', optionD: 'A deployment', correctAnswer: 'B', difficulty: 'Easy' },
            { id: 'q-023', quizId: 'quiz-005', question: 'What is the critical path in project management?', optionA: 'The shortest path', optionB: 'The most expensive path', optionC: 'The longest sequence of dependent tasks', optionD: 'The easiest path', correctAnswer: 'C', difficulty: 'Hard' },
            { id: 'q-024', quizId: 'quiz-005', question: 'RACI matrix stands for:', optionA: 'Responsible, Accountable, Consulted, Informed', optionB: 'Ready, Active, Complete, Invoiced', optionC: 'Resource, Action, Control, Implement', optionD: 'Review, Approve, Create, Initiate', correctAnswer: 'A', difficulty: 'Medium' },
            { id: 'q-025', quizId: 'quiz-005', question: 'Which is NOT a project management methodology?', optionA: 'Agile', optionB: 'Waterfall', optionC: 'Scrum', optionD: 'Compilation', correctAnswer: 'D', difficulty: 'Easy' },
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
}

// Generic CRUD operations
function getItems(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

// Employee operations
function getEmployees() { return getItems(STORAGE_KEYS.EMPLOYEES); }
function addEmployee(employee) { const employees = getEmployees(); employees.push(employee); setItems(STORAGE_KEYS.EMPLOYEES, employees); }
function findEmployeeByEmail(email) { return getEmployees().find(e => e.email === email); }
function findEmployeeById(id) { return getEmployees().find(e => e.id === id); }

// Quiz operations
function getQuizzes() { return getItems(STORAGE_KEYS.QUIZZES); }
function addQuiz(quiz) { const quizzes = getQuizzes(); quizzes.push(quiz); setItems(STORAGE_KEYS.QUIZZES, quizzes); }
function updateQuiz(quiz) { const quizzes = getQuizzes().map(q => q.id === quiz.id ? quiz : q); setItems(STORAGE_KEYS.QUIZZES, quizzes); }
function deleteQuiz(id) { const quizzes = getQuizzes().filter(q => q.id !== id); setItems(STORAGE_KEYS.QUIZZES, quizzes); }
function findQuizById(id) { return getQuizzes().find(q => q.id === id); }

// Question operations
function getQuestions() { return getItems(STORAGE_KEYS.QUESTIONS); }
function getQuestionsByQuizId(quizId) { return getQuestions().filter(q => q.quizId === quizId); }
function addQuestion(question) { const questions = getQuestions(); questions.push(question); setItems(STORAGE_KEYS.QUESTIONS, questions); }
function updateQuestion(question) { const questions = getQuestions().map(q => q.id === question.id ? question : q); setItems(STORAGE_KEYS.QUESTIONS, questions); }
function deleteQuestion(id) { const questions = getQuestions().filter(q => q.id !== id); setItems(STORAGE_KEYS.QUESTIONS, questions); }

// Quiz Attempt operations
function getAttempts() { return getItems(STORAGE_KEYS.ATTEMPTS); }
function getAttemptsByEmployee(employeeId) { return getAttempts().filter(a => a.employeeId === employeeId); }
function addAttempt(attempt) { const attempts = getAttempts(); attempts.push(attempt); setItems(STORAGE_KEYS.ATTEMPTS, attempts); }
function getAttemptCount(employeeId, quizId) { return getAttempts().filter(a => a.employeeId === employeeId && a.quizId === quizId).length; }

// Prediction operations
function getPredictions() { return getItems(STORAGE_KEYS.PREDICTIONS); }
function getPredictionsByEmployee(employeeId) { return getPredictions().filter(p => p.employeeId === employeeId); }
function addPrediction(prediction) { const predictions = getPredictions(); predictions.push(prediction); setItems(STORAGE_KEYS.PREDICTIONS, predictions); }

// Feedback operations
function getFeedbacks() { return getItems(STORAGE_KEYS.FEEDBACKS); }
function getFeedbacksByEmployee(employeeId) { return getFeedbacks().filter(f => f.employeeId === employeeId); }
function addFeedback(feedback) { const feedbacks = getFeedbacks(); feedbacks.push(feedback); setItems(STORAGE_KEYS.FEEDBACKS, feedbacks); }

// Current user session
function getCurrentUser() { const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER); return data ? JSON.parse(data) : null; }
function setCurrentUser(user) { if (user) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user)); else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER); }

// Initialize on load
initializeData();