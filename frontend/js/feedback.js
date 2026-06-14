// Generative AI Feedback Generator
// Uses template-based generation when Gemini API is unavailable

function generateFeedback(context) {
    const { name, quiz, score, total, accuracy, timeTaken, category, prevPerf } = context;
    
    const scorePct = Math.round((score / total) * 100);
    const minutes = Math.floor(timeTaken / 60);
    const improvement = accuracy - prevPerf;
    
    const templates = {
        'High Performer': [
            `${name} demonstrated exceptional performance in '${quiz}', achieving ${scorePct}% with ${accuracy}% accuracy. The assessment was completed efficiently in ${minutes} minutes, reflecting strong expertise and excellent time management. ${improvement > 0 ? `Notably, performance improved by ${Math.round(improvement)}% compared to previous assessments.` : 'This performance is consistent with track record of excellence.'} Recommendation: Consider mentoring junior team members and pursuing advanced certifications.`,
            
            `Outstanding work by ${name} on '${quiz}'. With ${accuracy}% accuracy and swift completion, this performance demonstrates deep subject matter understanding. ${improvement > 5 ? `A significant ${Math.round(improvement)}% improvement marks positive trajectory.` : ''} Moving forward, exploring leadership opportunities would further leverage this expertise.`
        ],
        'Average Performer': [
            `${name} completed '${quiz}' with ${scorePct}% score and ${accuracy}% accuracy in ${minutes} minutes. This reflects solid understanding of core concepts. ${improvement > 0 ? `The ${Math.round(improvement)}% improvement from previous attempts is encouraging.` : ''} To enhance performance, focus on advanced problem-solving techniques and review missed areas. Regular practice sessions and peer study groups are recommended.`,
            
            `Good effort by ${name} on '${quiz}', achieving ${accuracy}% accuracy. The foundational knowledge is adequate with room for growth. Targeted areas for improvement include deeper topic exploration and more consistent practice. Consider scheduling review sessions and seeking guidance on challenging topics.`
        ],
        'Needs Improvement': [
            `${name} has completed the '${quiz}' assessment with ${scorePct}% score and ${accuracy}% accuracy. While effort is noted, there are clear opportunities for skill enhancement. ${improvement > 0 ? `A ${Math.round(improvement)}% improvement from previous attempts demonstrates potential.` : 'A structured improvement plan is recommended.'} Immediate action items include scheduling mentorship sessions, enrolling in foundational courses, and dedicating additional practice time.`,
            
            `Results for ${name} on '${quiz}' indicate areas requiring focused attention. With ${accuracy}% accuracy, there is room for meaningful growth. Recommended plan: 1) Review incorrect answers with mentor, 2) Complete supplementary modules, 3) Schedule bi-weekly check-ins, 4) Practice with similar formats. The organization supports development through available resources.`
        ]
    };
    
    const categoryTemplates = templates[category] || templates['Average Performer'];
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
}

function generateQuickFeedback(category, accuracy) {
    const feedback = {
        'High Performer': accuracy >= 95 ? '🌟 Exceptional performance! Top-tier knowledge demonstrated.' : 
                          accuracy >= 85 ? '⭐ Excellent work! Strong command of the subject matter.' : 
                          '👏 Great job! Consistently high performance maintained.',
        'Average Performer': accuracy >= 75 ? '👍 Good performance! Minor improvements will push you to excellence.' :
                           accuracy >= 65 ? '📈 Solid foundation! Focus on advanced topics for growth.' :
                           '💪 Steady progress! Targeted practice will yield better results.',
        'Needs Improvement': accuracy >= 50 ? '📚 Room for growth. Structured practice recommended.' :
                            accuracy >= 35 ? '🎯 Focus needed. Consider mentorship and foundational review.' :
                            '🌱 Starting point identified. Personalized learning plan recommended.'
    };
    
    return feedback[category] || feedback['Average Performer'];
}