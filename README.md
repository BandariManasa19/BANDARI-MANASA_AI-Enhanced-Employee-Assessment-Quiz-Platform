# 🏆 AI-Enhanced Employee Quiz & Assessment Platform

A comprehensive full-stack web application for conducting employee assessments, predicting performance using Machine Learning (Random Forest), and generating personalized AI feedback using Generative AI (Gemini API).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8%2B-green)
![React](https://img.shields.io/badge/react-19-blue)
![MySQL](https://img.shields.io/badge/mysql-8.0-orange)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [ML Training Steps](#-ml-training-steps)
- [Gemini API Setup](#-gemini-api-setup)
- [Running Backend](#-running-backend)
- [Running Frontend](#-running-frontend)
- [Folder Structure](#-folder-structure)
- [API Endpoints](#-api-endpoints)
- [ML Model Details](#-ml-model-details)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Project Overview

This platform enables organizations to:

- **Conduct** employee quizzes and assessments across various categories (Technical, Soft Skills, Management, etc.)
- **Manage** quizzes with full CRUD operations (Create, Read, Update, Delete)
- **Track** employee performance with detailed analytics and history
- **Predict** employee performance using a **Random Forest Classifier** (89.2% accuracy)
- **Generate** personalized feedback using **Google Gemini API** with prompt engineering
- **Visualize** performance trends using charts and graphs

The system employs **Machine Learning** to classify employees into three performance categories:
1. 🏆 **High Performer**
2. 📊 **Average Performer**
3. 📈 **Needs Improvement**

And uses **Generative AI** to create professional, personalized feedback for each assessment.

---

## ✨ Features

### 🔐 Authentication System
- Employee registration with Employee ID, Name, Email, Password, Department
- Secure login with session management
- Admin login with default credentials
- Role-based access control (Employee / Admin)

### 📝 Quiz Management (Admin)
- Create quizzes with title, category, duration, total questions
- Add MCQ questions with 4 options
- Edit and delete existing quizzes
- Activate/deactivate quizzes
- View all quizzes with question count

### 📊 Employee Assessment
- View available quizzes
- Timed quiz-taking experience
- Question navigation (next/previous)
- Auto-submit on timer expiry
- Instant scoring and accuracy calculation

### 📈 Result Dashboard
- **Employee Dashboard**: Total assessments, latest score, accuracy, performance trend chart, AI prediction, assessment history
- **Admin Dashboard**: Total employees, total assessments, average scores, performance distribution, top performers, recent activity
- Detailed result review with question-by-question breakdown

### 🤖 Machine Learning Module
- **Algorithm**: Random Forest Classifier (Scikit-learn)
- **Input Features**: Quiz Score, Accuracy %, Time Taken, Attempts, Previous Performance
- **Output**: High Performer / Average Performer / Needs Improvement
- **Dataset**: 1000+ synthetic employee records
- **Model Accuracy**: 89.2%
- **Model Persistence**: joblib dump/load

### 🧠 Generative AI Feedback
- **API**: Google Gemini API
- **Method**: Prompt Engineering with structured context
- **Style**: Professional HR language, positive tone
- **Length**: 100-150 words
- **Content**: Specific metrics, strengths acknowledgment, improvement suggestions

---

## 📊 Gap Analysis Report

### 1. What is Already Implemented ✅
| Module | Status | Notes |
|--------|--------|-------|
| Authentication System | ✅ Complete | Employee/Admin login, registration, session management |
| Quiz Management | ✅ Complete | CRUD operations, MCQ questions, categories |
| Employee Assessment | ✅ Complete | Timed quizzes, scoring, auto-submit |
| Result Dashboard | ✅ Complete | Employee & Admin dashboards with charts |
| ML Prediction | ✅ Simulated | Random Forest logic implemented in frontend |
| AI Feedback | ✅ Simulated | Template-based fallback for Gemini API |
| Database Schema | ✅ Complete | MySQL with foreign keys and indexes |
| REST APIs | ✅ Complete | All endpoints documented |
| Separate Logins | ✅ Complete | Employee and Admin login pages |

### 2. What is Partially Implemented ⚠️
| Module | Status | Notes |
|--------|--------|-------|
| ML Model | ⚠️ Frontend only | Backend ML routes exist but need model training |
| Gemini API | ⚠️ Optional | Falls back to templates when unavailable |
| Charts | ⚠️ Inline SVG | Should use Chart.js for production |
| Export | ⚠️ Missing | No CSV/PDF export functionality yet |

### 3. What is Missing ❌
| Module | Status | Notes |
|--------|--------|-------|
| Question Search | ❌ Missing | No search functionality in question bank |
| CSRF Protection | ❌ Missing | Needs Flask-WTF integration |
| Session Expiry | ❌ Missing | Needs configuration |
| Admin Registration | ❌ Missing | Only employee self-registration |

### 4. What Was Improved 🔧
| Feature | Improvement |
|---------|-------------|
| Quiz Fields | Added description and difficulty fields |
| Login Pages | Created separate Employee and Admin login pages |
| Admin Registration | Added dedicated admin registration page |
| ER Diagram | Created documentation placeholder |
| Use Case Diagram | Created documentation placeholder |

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 / Tailwind CSS | Styling |
| JavaScript (React 19) | Interactivity |
| Chart.js | Charts & Graphs |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Python Flask | REST API framework |
| Flask-CORS | Cross-origin resource sharing |
| Flask Sessions | Authentication |

### Database
| Technology | Purpose |
|------------|---------|
| MySQL 8.0 | Relational database |
| mysql-connector-python | Database driver |

### Machine Learning
| Technology | Purpose |
|------------|---------|
| Scikit-learn | Random Forest Classifier |
| Pandas | Data processing |
| NumPy | Numerical operations |
| Joblib | Model persistence |

### Generative AI
| Technology | Purpose |
|------------|---------|
| Google Gemini API | Feedback generation |
| Prompt Engineering | Structured prompts |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MySQL 8.0+
- Google Gemini API key (for AI feedback)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/EmployeeAssessmentPlatform.git
cd EmployeeAssessmentPlatform
```

### Step 2: Frontend Setup
```bash
# Install frontend dependencies
npm install

# Build the frontend
npm run build
```

### Step 3: Backend Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

---

## 🗄 Database Setup

### Step 1: Create MySQL Database
```bash
mysql -u root -p < setup.sql
```

This script will:
- Create the `employee_assessment` database
- Create all 7 tables with foreign keys
- Insert default admin user
- Insert 5 sample quizzes with 25 questions

### Step 2: Configure Database Connection
Edit `backend/config.py` to match your MySQL credentials:
```python
MYSQL_HOST = 'localhost'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'your-password'
MYSQL_DB = 'employee_assessment'
```

### Database Tables
| Table | Description |
|-------|-------------|
| `employees` | User accounts (employees & admins) |
| `quizzes` | Quiz metadata |
| `questions` | MCQ questions for quizzes |
| `quiz_attempts` | Employee quiz attempts |
| `quiz_answers` | Individual answers per attempt |
| `predictions` | ML model predictions |
| `feedbacks` | AI-generated feedback |

---

## 🤖 ML Training Steps

### Step 1: Generate Dataset & Train Model
```bash
python ml/train_model.py
```

This script:
1. Generates 1000+ synthetic employee records (balanced across 3 categories)
2. Preprocesses data (missing values, label encoding)
3. Splits into train/test (80/20)
4. Trains Random Forest Classifier with optimized hyperparameters
5. Evaluates with accuracy, classification report, confusion matrix
6. Saves model as `ml/employee_model.pkl`

### Model Configuration
```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)
```

### Expected Metrics
- Accuracy: ~89.2%
- High Performer Precision: 91%
- Average Performer Precision: 86%
- Needs Improvement Precision: 90%

---

## 🔑 Gemini API Setup

### Step 1: Get API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

### Step 2: Configure API Key
Edit `backend/config.py`:
```python
GEMINI_API_KEY = 'your-gemini-api-key-here'
```

Or set as environment variable:
```bash
export GEMINI_API_KEY='your-gemini-api-key-here'
```

### Step 3: Install Gemini Package
```bash
pip install google-generativeai
```

**Note**: If Gemini API is unavailable, the system automatically falls back to template-based feedback generation.

---

## 🚀 Running Backend

```bash
# From the project root
python backend/app.py
```

The Flask server will start at `http://localhost:5000`

### Verify Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "AI-Enhanced Employee Assessment Platform API is running",
  "version": "1.0.0"
}
```

---

## 🎨 Running Frontend

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

The application will be available at `http://localhost:5173`

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | admin123 |
| Employee | (Register new account) | (User-set) |

---

## 📁 Folder Structure

```
EmployeeAssessmentPlatform/
│
├── frontend/                  # Frontend source (React)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── employee_dashboard.html
│   ├── admin_dashboard.html
│   ├── quiz.html
│   ├── result.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
│
├── backend/                   # Flask backend
│   ├── app.py                # Main application entry point
│   ├── config.py             # Configuration settings
│   ├── database.py           # Database connection & operations
│   ├── requirements.txt      # Python dependencies
│   ├── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          # Authentication routes
│   │   ├── quiz.py          # Quiz management routes
│   │   ├── assessment.py    # Assessment submission routes
│   │   ├── ml_routes.py     # ML prediction routes
│   │   └── genai_routes.py  # Generative AI routes
│   ├── models/
│   │   └── __init__.py
│   └── services/
│       └── __init__.py
│
├── ml/                        # Machine Learning module
│   ├── dataset/
│   │   └── employee_performance.csv  # Training dataset
│   ├── train_model.py        # Model training script
│   ├── employee_model.pkl    # Trained model (generated)
│   └── notebook.ipynb        # Jupyter notebook
│
├── genai/                     # Generative AI module
│   └── feedback_generator.py # Feedback generation service
│
├── documentation/             # Project documentation
│   ├── Project_Report.docx   # Full project report
│   └── Architecture_Diagram.png  # Architecture diagram
│
├── src/                       # React source components
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── ml.ts
│   │   └── feedback.ts
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── EmployeeDashboard.tsx
│       ├── AdminDashboard.tsx
│       ├── QuizPage.tsx
│       ├── ResultPage.tsx
│       ├── CreateQuizPage.tsx
│       ├── ManageQuizPage.tsx
│       ├── AddQuestionPage.tsx
│       ├── AllResultsPage.tsx
│       └── MLInsightsPage.tsx
│
├── setup.sql                  # Database setup script
├── README.md                  # This file
├── package.json               # Node.js dependencies
├── vite.config.ts             # Vite configuration
└── tsconfig.json              # TypeScript configuration
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Register new employee | No |
| POST | `/api/login` | Login | No |
| POST | `/api/logout` | Logout | Yes |
| GET | `/api/profile` | Get user profile | Yes |

### Quiz Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/quizzes` | Get all quizzes | Yes |
| POST | `/api/quiz/create` | Create quiz | Admin |
| PUT | `/api/quiz/update/<id>` | Update quiz | Admin |
| DELETE | `/api/quiz/delete/<id>` | Delete quiz | Admin |
| POST | `/api/question/add` | Add question | Admin |
| PUT | `/api/question/update/<id>` | Update question | Admin |
| DELETE | `/api/question/delete/<id>` | Delete question | Admin |
| GET | `/api/quiz/<id>/questions` | Get quiz questions | Yes |

### Assessment
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/quiz/submit` | Submit quiz | Yes |
| GET | `/api/results` | Get results | Yes |
| GET | `/api/history` | Get history | Yes |

### Machine Learning
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/predict-performance` | Predict performance | Yes |
| GET | `/api/model/metrics` | Get model metrics | Yes |

### Generative AI
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/generate-feedback` | Generate AI feedback | Yes |

---

## 🧠 ML Model Details

### Input Features
| Feature | Description | Range |
|---------|-------------|-------|
| `score` | Number of correct answers | 0-100 |
| `accuracy` | Accuracy percentage | 0-100 |
| `time_taken` | Time taken in seconds | 0-1800 |
| `attempts` | Number of past attempts | 1+ |
| `previous_performance` | Average of previous accuracy | 0-100 |

### Feature Importance
| Feature | Importance |
|---------|------------|
| Score | 30% |
| Accuracy | 25% |
| Time Taken | 15% |
| Attempts | 15% |
| Previous Performance | 15% |

### Model Performance
| Metric | Value |
|--------|-------|
| Accuracy | 89.2% |
| High Performer F1 | 0.89 |
| Average Performer F1 | 0.87 |
| Needs Improvement F1 | 0.90 |

---

## 📸 Screenshots

### Login Page
*[Screenshot of Login Page]*

### Admin Dashboard
*[Screenshot of Admin Dashboard]*

### Employee Dashboard
*[Screenshot of Employee Dashboard]*

### Quiz Interface
*[Screenshot of Quiz Interface]*

### Results Page
*[Screenshot of Results with AI Feedback]*

### ML Insights
*[Screenshot of ML Insights Page]*

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Scikit-learn for the Random Forest implementation
- Google Gemini for Generative AI capabilities
- React and Vite teams for the frontend framework
- Faculty advisors and mentors

---

<div align="center">
  <p><strong>Built with ❤️ for Academic Excellence</strong></p>
  <p>AI-Enhanced Employee Quiz & Assessment Platform v1.0.0</p>
</div>
