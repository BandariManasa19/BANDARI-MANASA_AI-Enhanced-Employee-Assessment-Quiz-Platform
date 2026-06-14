import React, { useMemo } from 'react';
import { getPredictions } from '../utils/storage';
import { getModelMetrics } from '../utils/ml';

type Page = 'login' | 'admin-login' | 'register' | 'admin-register' | 'employee-dashboard' | 'admin-dashboard' | 'quiz' | 'result' | 'create-quiz' | 'manage-quiz' | 'add-question' | 'all-results' | 'ml-insights';

interface MLInsightsPageProps {
  onNavigate: (page: Page) => void;
}

const MLInsightsPage: React.FC<MLInsightsPageProps> = () => {
  const predictions = useMemo(() => getPredictions(), []);
  const metrics = getModelMetrics();

  // Prediction distribution
  const distribution = predictions.reduce((acc, p) => {
    acc[p.performanceCategory] = (acc[p.performanceCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = predictions.length || 1;

  // Average confidence
  const avgConfidence = predictions.length > 0
    ? Math.round((predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length) * 100)
    : 0;

  // Feature importance display
  const featureImportance = Object.entries(metrics.featureImportance)
    .sort(([, a], [, b]) => b - a);

  // Confusion matrix labels
  const labels = ['High Performer', 'Average Performer', 'Needs Improvement'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ML & AI Insights 🧠</h1>
        <p className="text-gray-500 mt-1">Random Forest model performance and prediction analytics</p>
      </div>

      {/* Model Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-indigo-200 text-sm mb-1">Model Accuracy</p>
          <p className="text-3xl font-bold">{(metrics.accuracy * 100).toFixed(1)}%</p>
          <p className="text-indigo-200 text-xs mt-2">Random Forest Classifier</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Predictions</p>
          <p className="text-3xl font-bold text-gray-900">{predictions.length}</p>
          <p className="text-xs text-gray-400 mt-2">Made on quiz submissions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Avg Confidence</p>
          <p className="text-3xl font-bold text-gray-900">{avgConfidence}%</p>
          <p className="text-xs text-gray-400 mt-2">Across all predictions</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Training Data</p>
          <p className="text-3xl font-bold text-gray-900">1000</p>
          <p className="text-xs text-gray-400 mt-2">Synthetic employee records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Model Architecture */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Architecture</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Algorithm</p>
                  <p className="text-sm text-gray-500">Random Forest Classifier (Scikit-learn)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">Input Features (5)</p>
              <div className="flex flex-wrap gap-2">
                {['Quiz Score', 'Accuracy %', 'Time Taken', 'Attempts', 'Previous Performance'].map((f) => (
                  <span key={f} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">Output Classes (3)</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">🏆 High Performer</span>
                <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">📊 Average Performer</span>
                <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-full">📈 Needs Improvement</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">Pipeline</p>
              <div className="flex items-center space-x-2 text-xs">
                {['Data Preprocessing', 'Label Encoding', 'Train-Test Split', 'RF Training', 'Evaluation', 'Deployment'].map((step, idx) => (
                  <React.Fragment key={step}>
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{step}</span>
                    {idx < 5 && <span className="text-gray-400">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Importance</h3>
          <p className="text-sm text-gray-500 mb-4">How much each feature contributes to predictions</p>
          <div className="space-y-4">
            {featureImportance.map(([feature, importance]) => {
              const pct = Math.round(importance * 100);
              const featureName = feature.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
              const colors: Record<string, string> = {
                score: 'from-blue-500 to-cyan-500',
                accuracy: 'from-purple-500 to-pink-500',
                time_taken: 'from-amber-500 to-orange-500',
                attempts: 'from-green-500 to-emerald-500',
                previous_performance: 'from-red-500 to-rose-500',
              };
              return (
                <div key={feature}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{featureName}</span>
                    <span className="text-sm font-bold text-gray-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${colors[feature] || 'from-gray-400 to-gray-500'} h-3 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confusion Matrix</h3>
        <p className="text-sm text-gray-500 mb-4">Model prediction accuracy across classes (from training evaluation)</p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-lg mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-xs text-gray-500">Actual ↓ / Predicted →</th>
                {labels.map((label) => (
                  <th key={label} className="px-4 py-2 text-xs text-gray-500 text-center">{label.split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {labels.map((label, rowIdx) => (
                <tr key={label}>
                  <td className="px-4 py-2 text-xs font-medium text-gray-700">{label}</td>
                  {metrics.confusionMatrix[rowIdx].map((val, colIdx) => (
                    <td key={colIdx} className="px-4 py-2 text-center">
                      <span className={`inline-block w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm ${
                        rowIdx === colIdx
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification Report</h3>
          <div className="space-y-3">
            {labels.map((label) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-2">{label}</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Precision</p>
                    <p className="text-sm font-bold text-indigo-600">
                      {(metrics.precision[label as keyof typeof metrics.precision] * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Recall</p>
                    <p className="text-sm font-bold text-purple-600">
                      {(metrics.recall[label as keyof typeof metrics.recall] * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">F1-Score</p>
                    <p className="text-sm font-bold text-emerald-600">
                      {(metrics.f1Score[label as keyof typeof metrics.f1Score] * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Prediction Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution of predictions from actual quiz submissions</p>
          
          {predictions.length > 0 ? (
            <div className="space-y-6">
              {[
                { key: 'High Performer', icon: '🏆', color: 'emerald' },
                { key: 'Average Performer', icon: '📊', color: 'amber' },
                { key: 'Needs Improvement', icon: '📈', color: 'red' },
              ].map(({ key, icon, color }) => {
                const count = distribution[key] || 0;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center text-sm font-medium text-gray-700">
                        <span className="mr-2">{icon}</span>
                        {key}
                      </span>
                      <span className="text-sm text-gray-500">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                      <div
                        className={`bg-${color}-500 h-4 rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No predictions made yet</p>
              <p className="text-sm text-gray-400 mt-1">Predictions appear when employees submit quizzes</p>
            </div>
          )}
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Technical Implementation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">ML Framework</p>
                <p className="text-xs text-gray-400">Scikit-learn RandomForestClassifier</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">Data Processing</p>
                <p className="text-xs text-gray-400">Pandas, NumPy for feature engineering</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">Model Persistence</p>
                <p className="text-xs text-gray-400">joblib.dump() / joblib.load()</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">GenAI Integration</p>
                <p className="text-xs text-gray-400">Google Gemini API with prompt engineering</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">API Architecture</p>
                <p className="text-xs text-gray-400">Flask REST API with session auth</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-gray-400 mr-2">•</span>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-gray-400">MySQL with foreign key relationships</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLInsightsPage;
