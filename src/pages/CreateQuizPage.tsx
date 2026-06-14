import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addQuiz } from '../utils/storage';
import { Quiz } from '../types';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface CreateQuizPageProps {
  onNavigate: (page: Page, params?: { quizId?: string }) => void;
}

const categories = ['Technical', 'Soft Skills', 'Management', 'Compliance', 'General Knowledge', 'Leadership'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const CreateQuizPage: React.FC<CreateQuizPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    duration: 30,
    totalQuestions: 5,
    difficulty: 'Medium',
  });
  const [success, setSuccess] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      duration: formData.duration,
      totalQuestions: formData.totalQuestions,
      difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard',
      createdBy: user?.id || '',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    addQuiz(newQuiz);
    setCreatedQuizId(newQuiz.id);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Created Successfully!</h2>
          <p className="text-gray-500 mb-6">"{formData.title}" has been created. Now add questions to it.</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => onNavigate('add-question', { quizId: createdQuizId })}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Add Questions
            </button>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('admin-dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="text-gray-500 mt-1">Set up a new assessment for employees</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., JavaScript Fundamentals"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              rows={3}
              placeholder="Brief description of the quiz..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                min="5"
                max="180"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Questions</label>
              <input
                type="number"
                value={formData.totalQuestions}
                onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4">
            <p className="text-sm text-indigo-800">
              <strong>Note:</strong> After creating the quiz, you'll be able to add MCQ questions with 4 options each.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;
