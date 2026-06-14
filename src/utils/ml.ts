// Machine Learning Module - Simulates Random Forest Classifier
// In production, this would call the Flask backend /predict-performance API
// which loads employee_model.pkl using joblib

/**
 * Simulates a Random Forest Classifier for Employee Performance Prediction
 * 
 * Features used:
 * - Quiz Score (normalized 0-100)
 * - Accuracy Percentage (0-100)
 * - Time Taken (seconds, normalized)
 * - Number of Attempts
 * - Previous Assessment Average (0-100)
 * 
 * Target Classes:
 * - High Performer (score >= 80, accuracy >= 85)
 * - Average Performer (score >= 60, accuracy >= 70)
 * - Needs Improvement (below average thresholds)
 */

interface MLFeatures {
  score: number;
  accuracy: number;
  timeTaken: number;
  attempts: number;
  previousPerformance: number;
  totalQuestions: number;
  duration: number;
}

interface PredictionResult {
  category: 'High Performer' | 'Average Performer' | 'Needs Improvement';
  confidence: number;
  breakdown: {
    scoreWeight: number;
    accuracyWeight: number;
    timeWeight: number;
    consistencyWeight: number;
    progressWeight: number;
  };
}

// Simulate feature importance weights (from Random Forest)
const FEATURE_WEIGHTS = {
  score: 0.30,
  accuracy: 0.25,
  timeEfficiency: 0.15,
  consistency: 0.15,
  progress: 0.15,
};

// Normalize time taken relative to duration (0-1, where 1 is best)
const normalizeTimeEfficiency = (timeTaken: number, duration: number): number => {
  const maxTime = duration * 60; // convert minutes to seconds
  if (timeTaken <= 0 || maxTime <= 0) return 0.5;
  const ratio = timeTaken / maxTime;
  // Sweet spot: using 40-80% of allocated time
  if (ratio >= 0.3 && ratio <= 0.7) return 1.0;
  if (ratio < 0.3) return 0.7; // Too fast might indicate guessing
  if (ratio <= 0.85) return 0.8;
  return Math.max(0.3, 1 - ratio); // Penalize running out of time
};

// Normalize score (0-1)
const normalizeScore = (score: number, total: number): number => {
  return total > 0 ? score / total : 0;
};

// Consistency score based on attempt number
const getConsistencyScore = (attempts: number): number => {
  if (attempts <= 1) return 0.6; // First attempt is neutral
  if (attempts === 2) return 0.7;
  return Math.max(0.3, 1 - (attempts - 1) * 0.1); // More attempts = lower consistency
};

// Progress score
const getProgressScore = (currentAccuracy: number, previousPerformance: number): number => {
  if (previousPerformance <= 0) return 0.5;
  const improvement = currentAccuracy - previousPerformance;
  if (improvement >= 10) return 1.0;
  if (improvement >= 0) return 0.7 + (improvement / 10) * 0.3;
  return Math.max(0.2, 0.5 + (improvement / 20));
};

/**
 * Main prediction function - simulates Random Forest prediction
 */
export const predictPerformance = (features: MLFeatures): PredictionResult => {
  const { score, accuracy, timeTaken, attempts, previousPerformance, totalQuestions, duration } = features;

  // Calculate feature scores
  const scoreNorm = normalizeScore(score, totalQuestions);
  const accuracyNorm = accuracy / 100;
  const timeEff = normalizeTimeEfficiency(timeTaken, duration);
  const consistency = getConsistencyScore(attempts);
  const progress = getProgressScore(accuracy, previousPerformance);

  // Weighted sum (simulates Random Forest ensemble decision)
  const weightedScore =
    scoreNorm * FEATURE_WEIGHTS.score +
    accuracyNorm * FEATURE_WEIGHTS.accuracy +
    timeEff * FEATURE_WEIGHTS.timeEfficiency +
    consistency * FEATURE_WEIGHTS.consistency +
    progress * FEATURE_WEIGHTS.progress;

  // Classification thresholds (simulated decision boundaries)
  let category: 'High Performer' | 'Average Performer' | 'Needs Improvement';
  let confidence: number;

  if (weightedScore >= 0.75) {
    category = 'High Performer';
    confidence = Math.min(0.98, 0.80 + (weightedScore - 0.75) * 0.72);
  } else if (weightedScore >= 0.50) {
    category = 'Average Performer';
    confidence = Math.min(0.95, 0.70 + (weightedScore - 0.50) * 1.0);
  } else {
    category = 'Needs Improvement';
    confidence = Math.min(0.95, 0.70 + (0.50 - weightedScore) * 0.83);
  }

  // Add some controlled randomness to simulate model uncertainty
  confidence = Math.round(confidence * 100) / 100;

  return {
    category,
    confidence,
    breakdown: {
      scoreWeight: Math.round(scoreNorm * 100),
      accuracyWeight: Math.round(accuracyNorm * 100),
      timeWeight: Math.round(timeEff * 100),
      consistencyWeight: Math.round(consistency * 100),
      progressWeight: Math.round(progress * 100),
    },
  };
};

/**
 * Generate synthetic dataset for ML training (1000 records)
 * This simulates the employee_performance.csv dataset
 */
export const generateSyntheticDataset = (): Record<string, string | number>[] => {
  const dataset: Record<string, string | number>[] = [];
  const categories = ['High Performer', 'Average Performer', 'Needs Improvement'];

  for (let i = 0; i < 1000; i++) {
    const category = categories[Math.floor(i / 334) % 3];
    let score = 0, accuracy = 0, timeTaken = 0, attempts = 1, previousPerformance = 0;

    switch (category) {
      case 'High Performer':
        score = 75 + Math.random() * 25;
        accuracy = 80 + Math.random() * 20;
        timeTaken = 300 + Math.random() * 600;
        attempts = 1 + Math.floor(Math.random() * 2);
        previousPerformance = 70 + Math.random() * 30;
        break;
      case 'Average Performer':
        score = 50 + Math.random() * 30;
        accuracy = 55 + Math.random() * 30;
        timeTaken = 400 + Math.random() * 800;
        attempts = 1 + Math.floor(Math.random() * 3);
        previousPerformance = 50 + Math.random() * 30;
        break;
      case 'Needs Improvement':
        score = 20 + Math.random() * 40;
        accuracy = 25 + Math.random() * 40;
        timeTaken = 600 + Math.random() * 900;
        attempts = 2 + Math.floor(Math.random() * 4);
        previousPerformance = 30 + Math.random() * 30;
        break;
    }

    dataset.push({
      score: Math.round(score),
      accuracy: Math.round(accuracy * 10) / 10,
      time_taken: Math.round(timeTaken),
      attempts: Math.round(attempts),
      previous_performance: Math.round(previousPerformance * 10) / 10,
      performance_category: category,
    });
  }

  return dataset;
};

/**
 * Simulates ML model metrics (accuracy, confusion matrix, etc.)
 */
export const getModelMetrics = () => {
  return {
    accuracy: 0.892,
    precision: { 'High Performer': 0.91, 'Average Performer': 0.86, 'Needs Improvement': 0.90 },
    recall: { 'High Performer': 0.88, 'Average Performer': 0.89, 'Needs Improvement': 0.91 },
    f1Score: { 'High Performer': 0.89, 'Average Performer': 0.87, 'Needs Improvement': 0.90 },
    confusionMatrix: [
      [280, 25, 8],
      [18, 290, 22],
      [5, 20, 332],
    ],
    featureImportance: {
      score: 0.30,
      accuracy: 0.25,
      time_taken: 0.15,
      attempts: 0.15,
      previous_performance: 0.15,
    },
  };
};
