import React, { useState, useMemo } from 'react';
import { getQuizzes, deleteQuiz, updateQuiz, getQuestionsByQuizId } from '../utils/storage';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface ManageQuizPageProps {
  onNavigate: (page: Page, params?: { quizId?: string }) => void;
}

const ManageQuizPage: React.FC<ManageQuizPageProps> = ({ onNavigate }) => {
  const [refresh, setRefresh] = useState(0);
  const quizzes = useMemo(() => getQuizzes(), [refresh]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', category: '', duration: 0, totalQuestions: 0 });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteQuiz(id);
    setConfirmDelete(null);
    setRefresh((r) => r + 1);
  };

  const handleEdit = (quiz: typeof quizzes[0]) => {
    setEditingId(quiz.id);
    setEditData({
      title: quiz.title,
      category: quiz.category,
      duration: quiz.duration,
      totalQuestions: quiz.totalQuestions,
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    const quiz = quizzes.find((q) => q.id === editingId);
    if (!quiz) return;

    updateQuiz({
      ...quiz,
      title: editData.title,
      category: editData.category,
      duration: editData.duration,
      totalQuestions: editData.totalQuestions,
    });
    setEditingId(null);
    setRefresh((r) => r + 1);
  };

  const toggleActive = (quiz: typeof quizzes[0]) => {
    updateQuiz({ ...quiz, isActive: !quiz.isActive });
    setRefresh((r) => r + 1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Quizzes</h1>
          <p className="text-gray-500 mt-1">Edit, delete, and manage all quizzes</p>
        </div>
        <button
          onClick={() => onNavigate('create-quiz')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Quiz
        </button>
      </div>

      {quizzes.length > 0 ? (
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const questions = getQuestionsByQuizId(quiz.id);
            const isEditing = editingId === quiz.id;

            return (
              <div key={quiz.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isEditing ? (
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Edit Quiz</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={editData.duration}
                          onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Questions</label>
                        <input
                          type="number"
                          value={editData.totalQuestions}
                          onChange={(e) => setEditData({ ...editData, totalQuestions: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${quiz.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>{quiz.category}</span>
                          <span>•</span>
                          <span>{quiz.duration} min</span>
                          <span>•</span>
                          <span>{questions.length} questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onNavigate('add-question', { quizId: quiz.id })}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        Questions
                      </button>
                      <button
                        onClick={() => toggleActive(quiz)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          quiz.isActive ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {quiz.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEdit(quiz)}
                        className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                      >
                        Edit
                      </button>
                      {confirmDelete === quiz.id ? (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleDelete(quiz.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(quiz.id)}
                          className="px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Quizzes Yet</h3>
          <p className="text-gray-500 mb-4">Create your first quiz to get started.</p>
          <button
            onClick={() => onNavigate('create-quiz')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Create Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageQuizPage;
