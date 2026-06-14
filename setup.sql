-- =====================================================
-- AI-Enhanced Employee Quiz & Assessment Platform
-- MySQL Database Setup Script
-- =====================================================
-- 
-- This script creates all required database tables
-- with proper foreign key relationships and indexes.
--
-- Usage: mysql -u root -p < setup.sql
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS employee_assessment
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE employee_assessment;

-- =====================================================
-- Table: employees
-- Stores employee and admin user information
-- =====================================================
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,  -- SHA-256 hashed
    department VARCHAR(50) NOT NULL,
    role ENUM('employee', 'admin') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_employee_id (employee_id),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- =====================================================
-- Table: quizzes
-- Stores quiz metadata
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    duration INT NOT NULL DEFAULT 30,  -- Duration in minutes
    total_questions INT NOT NULL DEFAULT 5,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_by VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB;

-- =====================================================
-- Table: questions
-- Stores MCQ questions for each quiz
-- =====================================================
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(36) PRIMARY KEY,
    quiz_id VARCHAR(36) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB;

-- =====================================================
-- Table: quiz_attempts
-- Stores each quiz attempt by employees
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(36) PRIMARY KEY,
    employee_id VARCHAR(36) NOT NULL,
    quiz_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    score INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    time_taken INT NOT NULL DEFAULT 0,  -- Time in seconds
    attempt_number INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_end_time (end_time)
) ENGINE=InnoDB;

-- =====================================================
-- Table: quiz_answers
-- Stores individual answers for each attempt
-- =====================================================
CREATE TABLE IF NOT EXISTS quiz_answers (
    id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    question_id VARCHAR(36) NOT NULL,
    selected_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_attempt_id (attempt_id)
) ENGINE=InnoDB;

-- =====================================================
-- Table: predictions
-- Stores ML model predictions for each attempt
-- =====================================================
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    performance_category ENUM('High Performer', 'Average Performer', 'Needs Improvement') NOT NULL,
    confidence DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
    score INT NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    time_taken INT NOT NULL,
    attempts INT NOT NULL DEFAULT 1,
    previous_performance DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id),
    INDEX idx_performance_category (performance_category)
) ENGINE=InnoDB;

-- =====================================================
-- Table: feedbacks
-- Stores AI-generated feedback for each attempt
-- =====================================================
CREATE TABLE IF NOT EXISTS feedbacks (
    id VARCHAR(36) PRIMARY KEY,
    attempt_id VARCHAR(36) NOT NULL,
    employee_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_employee_id (employee_id)
) ENGINE=InnoDB;

-- =====================================================
-- Insert Default Admin User
-- Email: admin@company.com
-- Password: admin123 (SHA-256 hashed)
-- =====================================================
INSERT INTO employees (id, employee_id, name, email, password, department, role)
VALUES (
    'admin-001',
    'ADM001',
    'System Administrator',
    'admin@company.com',
    SHA2('admin123', 256),
    'IT Administration',
    'admin'
) ON DUPLICATE KEY UPDATE email = email;

-- =====================================================
-- Insert Sample Quizzes
-- =====================================================

-- Quiz 1: JavaScript Fundamentals
INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active)
VALUES ('quiz-001', 'JavaScript Fundamentals', 'Technical', 30, 5, 'admin-001', TRUE)
ON DUPLICATE KEY UPDATE title = title;

-- Quiz 2: Python Programming Basics
INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active)
VALUES ('quiz-002', 'Python Programming Basics', 'Technical', 25, 5, 'admin-001', TRUE)
ON DUPLICATE KEY UPDATE title = title;

-- Quiz 3: Data Structures & Algorithms
INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active)
VALUES ('quiz-003', 'Data Structures & Algorithms', 'Technical', 45, 5, 'admin-001', TRUE)
ON DUPLICATE KEY UPDATE title = title;

-- Quiz 4: Communication Skills
INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active)
VALUES ('quiz-004', 'Communication Skills', 'Soft Skills', 20, 5, 'admin-001', TRUE)
ON DUPLICATE KEY UPDATE title = title;

-- Quiz 5: Project Management
INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active)
VALUES ('quiz-005', 'Project Management', 'Management', 35, 5, 'admin-001', TRUE)
ON DUPLICATE KEY UPDATE title = title;

-- =====================================================
-- Insert Sample Questions for Quiz 1 (JavaScript)
-- =====================================================
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('q-001', 'quiz-001', 'What is the output of typeof null in JavaScript?', '"null"', '"undefined"', '"object"', '"boolean"', 'C'),
('q-002', 'quiz-001', 'Which method is used to add an element at the end of an array?', 'push()', 'pop()', 'shift()', 'unshift()', 'A'),
('q-003', 'quiz-001', 'What does === operator check?', 'Value only', 'Type only', 'Value and Type', 'Reference', 'C'),
('q-004', 'quiz-001', 'Which keyword is used to declare a constant in JavaScript?', 'var', 'let', 'const', 'static', 'C'),
('q-005', 'quiz-001', 'What is a closure in JavaScript?', 'A function with no return', 'A function that has access to outer scope', 'A closed loop', 'A private variable', 'B')
ON DUPLICATE KEY UPDATE question = question;

-- =====================================================
-- Insert Sample Questions for Quiz 2 (Python)
-- =====================================================
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('q-006', 'quiz-002', 'What is the output of print(type([]))?', '<class list>', '<class array>', '<class tuple>', '<class dict>', 'A'),
('q-007', 'quiz-002', 'Which keyword is used to define a function in Python?', 'function', 'func', 'def', 'define', 'C'),
('q-008', 'quiz-002', 'What is the output of 3 ** 2 in Python?', '6', '9', '5', '1', 'B'),
('q-009', 'quiz-002', 'Which of these is NOT a valid Python data type?', 'list', 'dict', 'array', 'tuple', 'C'),
('q-010', 'quiz-002', 'How do you start a comment in Python?', '//', '/*', '#', '--', 'C')
ON DUPLICATE KEY UPDATE question = question;

-- =====================================================
-- Insert Sample Questions for Quiz 3 (DSA)
-- =====================================================
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('q-011', 'quiz-003', 'What is the time complexity of binary search?', 'O(n)', 'O(n^2)', 'O(log n)', 'O(1)', 'C'),
('q-012', 'quiz-003', 'Which data structure uses FIFO?', 'Stack', 'Queue', 'Tree', 'Graph', 'B'),
('q-013', 'quiz-003', 'What is the worst case time complexity of QuickSort?', 'O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)', 'C'),
('q-014', 'quiz-003', 'Which traversal visits root first?', 'Inorder', 'Preorder', 'Postorder', 'Level order', 'B'),
('q-015', 'quiz-003', 'What is the space complexity of a recursive Fibonacci?', 'O(1)', 'O(n)', 'O(n^2)', 'O(2^n)', 'B')
ON DUPLICATE KEY UPDATE question = question;

-- =====================================================
-- Insert Sample Questions for Quiz 4 (Communication)
-- =====================================================
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('q-016', 'quiz-004', 'Active listening involves:', 'Interrupting to share ideas', 'Fully concentrating on the speaker', 'Thinking about your response', 'Checking your phone', 'B'),
('q-017', 'quiz-004', 'Which is the most effective communication channel for complex issues?', 'Email', 'Phone call', 'Face-to-face meeting', 'Text message', 'C'),
('q-018', 'quiz-004', 'Non-verbal communication accounts for what percentage of meaning?', '10%', '30%', '55%', '90%', 'C'),
('q-019', 'quiz-004', 'Constructive feedback should be:', 'Vague and general', 'Specific and actionable', 'Critical only', 'Avoided', 'B'),
('q-020', 'quiz-004', 'The best way to handle workplace conflict is:', 'Ignore it', 'Address it directly and professionally', 'Gossip about it', 'Report to HR immediately', 'B')
ON DUPLICATE KEY UPDATE question = question;

-- =====================================================
-- Insert Sample Questions for Quiz 5 (Project Management)
-- =====================================================
INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer)
VALUES 
('q-021', 'quiz-005', 'What does SMART stand for in goal setting?', 'Simple, Measurable, Achievable, Realistic, Timely', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Smart, Modern, Actionable, Reliable, Tested', 'Strategic, Meaningful, Accurate, Rapid, Thorough', 'B'),
('q-022', 'quiz-005', 'In Agile methodology, what is a Sprint?', 'A quick meeting', 'A time-boxed iteration', 'A bug fix', 'A deployment', 'B'),
('q-023', 'quiz-005', 'What is the critical path in project management?', 'The shortest path', 'The most expensive path', 'The longest sequence of dependent tasks', 'The easiest path', 'C'),
('q-024', 'quiz-005', 'RACI matrix stands for:', 'Responsible, Accountable, Consulted, Informed', 'Ready, Active, Complete, Invoiced', 'Resource, Action, Control, Implement', 'Review, Approve, Create, Initiate', 'A'),
('q-025', 'quiz-005', 'Which is NOT a project management methodology?', 'Agile', 'Waterfall', 'Scrum', 'Compilation', 'D')
ON DUPLICATE KEY UPDATE question = question;

-- =====================================================
-- Verification Queries
-- =====================================================
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS employee_count FROM employees;
SELECT COUNT(*) AS quiz_count FROM quizzes;
SELECT COUNT(*) AS question_count FROM questions;
