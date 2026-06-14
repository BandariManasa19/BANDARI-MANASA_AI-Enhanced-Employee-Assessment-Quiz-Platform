import React, { useState, useMemo } from 'react';
import { findQuizById, getQuestionsByQuizId, addQuestion, updateQuestion, deleteQuestion } from '../utils/storage';
import { Question } from '../types';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface AddQuestionPageProps {
  quizId: string;
  onNavigate: (page: Page) => void;
}

const AddQuestionPage: React.FC<AddQuestionPageProps> = ({ quizId, onNavigate }) => {
  const quiz = findQuizById(quizId);
  const [refresh, setRefresh] = useState(0);
  const questions = useMemo(() => getQuestionsByQuizId(quizId), [quizId, refresh]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
  });

  const resetForm = () => {
    setFormData({ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateQuestion({
        id: editingId,
        quizId,
        ...formData,
      });
    } else {
      addQuestion({
        id: `q-${Date.now()}`,
        quizId,
        ...formData,
      });
    }

    resetForm();
    setRefresh((r) => r + 1);
  };

  const handleEdit = (q: Question) => {
    setEditingId(q.id);
    setFormData({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteQuestion(id);
    setRefresh((r) => r + 1);
  };

  if (!quiz) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h2>
          <button onClick={() => onNavigate('manage-quiz')} className="text-indigo-600 hover:underline">
            Back to Manage Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('manage-quiz')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Manage Quizzes
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
            <p className="text-gray-500 mt-1">{quiz.title} • {questions.length}/{quiz.totalQuestions} questions added</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Question Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Question' : 'Add New Question'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Question</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                rows={2}
                placeholder="Enter the question..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                <div key={opt}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Option {opt}
                    {formData.correctAnswer === opt && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Correct</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData[`option${opt}` as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder={`Enter option ${opt}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correct Answer</label>
              <div className="flex space-x-3">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, correctAnswer: opt })}
                    className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                      formData.correctAnswer === opt
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Option {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                {editingId ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Questions List */}
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="w-7 h-7 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-xs font-bold mr-3">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-gray-900">{q.question}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-10">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                      <div
                        key={opt}
                        className={`text-sm px-3 py-1.5 rounded-lg ${
                          q.correctAnswer === opt
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        <span className="font-semibold">{opt}.</span> {q[`option${opt}` as keyof Question] as string}
                        {q.correctAnswer === opt && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  <button
                    onClick={() => handleEdit(q)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h3>
            <p className="text-gray-500 mb-4">Add questions to make this quiz functional.</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Add First Question
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddQuestionPage;
