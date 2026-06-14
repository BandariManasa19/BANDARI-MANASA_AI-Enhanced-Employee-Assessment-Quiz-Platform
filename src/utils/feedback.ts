// Generative AI Feedback Module - Simulates Gemini API feedback generation
// In production, this would call the Flask backend /generate-feedback API
// which uses the Google Gemini API with prompt engineering

interface FeedbackContext {
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  performanceCategory: string;
  previousPerformance: number;
  quizTitle: string;
  employeeName: string;
}

/**
 * Generates personalized employee performance feedback using AI
 * Simulates the Gemini API response with context-aware feedback
 * 
 * Prompt Structure (used in backend):
 * "Generate personalized employee performance feedback based on:
 *  Score, Accuracy, Time Taken, Performance Category, Previous Performance.
 *  Requirements: Professional HR language, Positive tone, 
 *  Improvement suggestions, 100-150 words"
 */
export const generateFeedback = (context: FeedbackContext): string => {
  const { score, totalQuestions, accuracy, timeTaken, performanceCategory, previousPerformance, quizTitle, employeeName } = context;
  
  const scorePercent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeStr = minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}` : `${seconds} seconds`;
  const improvement = accuracy - previousPerformance;

  // Feedback templates organized by performance category
  const highPerformerTemplates = [
    `${employeeName} demonstrated exceptional performance in the "${quizTitle}" assessment, achieving a score of ${score}/${totalQuestions} (${scorePercent}%) with ${accuracy}% accuracy. The assessment was completed efficiently in ${timeStr}, reflecting strong subject matter expertise and excellent time management skills. ${improvement > 0 ? `Notably, performance improved by ${Math.round(improvement)}% compared to previous assessments, indicating consistent professional growth.` : 'This performance is consistent with their track record of excellence.'} Recommendation: Consider mentoring junior team members and taking on advanced project responsibilities to further leverage this expertise.`,
    
    `Outstanding performance by ${employeeName} on the "${quizTitle}" quiz. With a remarkable ${accuracy}% accuracy rate and a perfect score ratio, this employee has shown deep understanding of the subject matter. The efficient completion time of ${timeStr} demonstrates both knowledge proficiency and strong analytical capabilities. ${improvement > 5 ? `A significant ${Math.round(improvement)}% improvement over previous performance marks a commendable upward trajectory.` : ''} Moving forward, exploring specialized certifications and leadership opportunities would be excellent next steps for career development.`,
    
    `${employeeName} has shown exemplary knowledge in "${quizTitle}", scoring ${score}/${totalQuestions} with ${accuracy}% accuracy. Completed in just ${timeStr}, this performance reflects thorough preparation and deep understanding. The ${performanceCategory.toLowerCase()} classification is well-deserved. ${previousPerformance > 0 ? `Compared to a previous average of ${previousPerformance}%, the current ${accuracy}% shows ${improvement >= 0 ? 'positive growth' : 'slight variation that can be addressed'} in performance.` : 'This establishes a strong baseline for future assessments.'} Recommended: Pursue advanced training modules and consider becoming a subject matter expert within the team.`
  ];

  const averagePerformerTemplates = [
    `${employeeName} completed the "${quizTitle}" assessment with a score of ${score}/${totalQuestions} (${scorePercent}%) and ${accuracy}% accuracy, completed in ${timeStr}. This represents a solid understanding of the core concepts covered in this assessment. ${improvement > 0 ? `The ${Math.round(improvement)}% improvement from previous assessments is encouraging and shows commitment to professional development.` : ''} To enhance performance further, focusing on advanced problem-solving techniques and reviewing areas where questions were missed would be beneficial. Recommended resources include practice exercises and peer study groups.`,
    
    `Good effort by ${employeeName} on the "${quizTitle}" quiz, achieving ${accuracy}% accuracy with a completion time of ${timeStr}. The score of ${score}/${totalQuestions} demonstrates adequate knowledge of fundamental concepts. ${previousPerformance > 0 ? `Performance has ${improvement >= 0 ? 'maintained consistency' : 'slightly declined'} compared to the previous average of ${previousPerformance}%.` : ''} Targeted improvement areas include deeper exploration of advanced topics and more consistent practice. Consider scheduling regular review sessions and seeking guidance from team leads on challenging topics to strengthen overall competency.`,
    
    `${employeeName} showed competent performance in the "${quizTitle}" assessment, earning ${score}/${totalQuestions} (${scorePercent}%). The ${accuracy}% accuracy rate indicates a good foundational understanding, though there is room for growth. The assessment was completed in ${timeStr}. ${improvement > 0 ? `Positive progress of ${Math.round(improvement)}% from previous scores shows dedication.` : 'Consistent practice will help strengthen weaker areas.'} Recommended action items: review incorrect answers, participate in team knowledge-sharing sessions, and attempt supplementary practice quizzes to build confidence in advanced concepts.`
  ];

  const needsImprovementTemplates = [
    `${employeeName} has completed the "${quizTitle}" assessment with a score of ${score}/${totalQuestions} (${scorePercent}%) and ${accuracy}% accuracy. While the effort to complete the assessment in ${timeStr} is noted, there are significant opportunities for skill enhancement. ${improvement > 0 ? `A ${Math.round(improvement)}% improvement from previous attempts demonstrates potential and willingness to grow.` : 'A structured improvement plan is recommended.'} Immediate action items: schedule a one-on-one with team lead to identify knowledge gaps, enroll in foundational training courses, and dedicate additional time to practice exercises. With focused effort and the right support, substantial improvement is achievable in the next assessment cycle.`,
    
    `The "${quizTitle}" assessment results for ${employeeName} indicate areas requiring focused attention. With a score of ${score}/${totalQuestions} and ${accuracy}% accuracy, there is significant room for improvement. ${previousPerformance > 0 ? `Previous performance average was ${previousPerformance}%, and the current results ${improvement >= 0 ? 'show slight improvement' : 'suggest a need for renewed focus'}.` : ''} Recommended development plan: 1) Review all incorrectly answered questions with a mentor, 2) Complete supplementary learning modules, 3) Schedule bi-weekly check-ins with supervisor, 4) Practice with similar quiz formats. This structured approach will help build confidence and competence progressively.`,
    
    `${employeeName}'s performance on "${quizTitle}" scored ${score}/${totalQuestions} with ${accuracy}% accuracy. While this indicates foundational knowledge gaps, it also presents a clear roadmap for professional development. The completion time of ${timeStr} suggests careful consideration of answers. ${improvement > 0 ? `The ${Math.round(improvement)}% positive trend from previous assessments is a good sign.` : 'With dedicated effort, meaningful improvement is achievable.'} A personalized learning path is recommended, including targeted training modules, mentorship pairing, and regular progress assessments. The organization is committed to supporting ${employeeName}'s growth and development through available learning resources.`
  ];

  // Select template based on category and add variety
  let templates: string[];
  switch (performanceCategory) {
    case 'High Performer':
      templates = highPerformerTemplates;
      break;
    case 'Average Performer':
      templates = averagePerformerTemplates;
      break;
    case 'Needs Improvement':
      templates = needsImprovementTemplates;
      break;
    default:
      templates = averagePerformerTemplates;
  }

  // Use a hash-like selection for variety (deterministic but varied)
  const index = (score + Math.floor(accuracy)) % templates.length;
  return templates[index];
};

/**
 * Generate quick summary feedback (for cards/previews)
 */
export const generateQuickFeedback = (performanceCategory: string, accuracy: number): string => {
  if (performanceCategory === 'High Performer') {
    if (accuracy >= 95) return '🌟 Exceptional performance! Top-tier knowledge demonstrated.';
    if (accuracy >= 85) return '⭐ Excellent work! Strong command of the subject matter.';
    return '👏 Great job! Consistently high performance maintained.';
  }
  if (performanceCategory === 'Average Performer') {
    if (accuracy >= 75) return '👍 Good performance! Minor improvements will push you to excellence.';
    if (accuracy >= 65) return '📈 Solid foundation! Focus on advanced topics for growth.';
    return '💪 Steady progress! Targeted practice will yield better results.';
  }
  if (accuracy >= 50) return '📚 Room for growth. Structured practice recommended.';
  if (accuracy >= 35) return '🎯 Focus needed. Consider mentorship and foundational review.';
  return '🌱 Starting point identified. Personalized learning plan recommended.';
};
