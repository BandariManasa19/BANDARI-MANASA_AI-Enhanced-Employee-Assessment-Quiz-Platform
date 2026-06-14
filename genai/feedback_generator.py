# Generative AI Feedback Generator
# Uses Google Gemini API to generate personalized employee performance feedback
# 
# Usage: python genai/feedback_generator.py
# 
# Prompt Engineering:
# - Structured prompt with context variables
# - Professional HR language requirements
# - Positive and constructive tone guidelines
# - Word count constraints (100-150 words)
# - Specific metric references

import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import Config


class FeedbackGenerator:
    """
    AI-Powered Feedback Generator using Google Gemini API
    
    This class generates personalized employee performance feedback
    based on assessment results using prompt engineering techniques.
    """
    
    def __init__(self):
        """Initialize the Gemini API client"""
        self.api_key = Config.GEMINI_API_KEY
        self.model_name = Config.GEMINI_MODEL
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the Gemini API client"""
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.client = genai.GenerativeModel(self.model_name)
            print(f"Gemini API initialized with model: {self.model_name}")
        except ImportError:
            print("Warning: google-generativeai not installed")
            print("Install with: pip install google-generativeai")
        except Exception as e:
            print(f"Warning: Gemini API initialization failed: {e}")
    
    def build_prompt(self, context):
        """
        Build a structured prompt for feedback generation
        
        Args:
            context (dict): Assessment context containing:
                - employeeName: Employee's full name
                - quizTitle: Quiz/assessment title
                - score: Number of correct answers
                - totalQuestions: Total questions in quiz
                - accuracy: Accuracy percentage
                - timeTaken: Time taken in seconds
                - performanceCategory: ML prediction category
                - previousPerformance: Previous assessment average
        
        Returns:
            str: Structured prompt for Gemini API
        """
        score_pct = round((context['score'] / context['totalQuestions']) * 100) if context['totalQuestions'] > 0 else 0
        minutes = context['timeTaken'] // 60
        seconds = context['timeTaken'] % 60
        improvement = context['accuracy'] - context['previousPerformance']
        
        prompt = f"""Generate personalized employee performance feedback based on the following assessment data:

=== Assessment Details ===
Employee Name: {context['employeeName']}
Assessment Title: {context['quizTitle']}
Score: {context['score']}/{context['totalQuestions']} ({score_pct}%)
Accuracy Rate: {context['accuracy']}%
Time Taken: {minutes} minutes and {seconds} seconds
Performance Category (AI Prediction): {context['performanceCategory']}
Previous Assessment Average: {context['previousPerformance']}%
Performance Change: {'+' if improvement >= 0 else ''}{round(improvement)}%

=== Requirements ===
1. Use professional HR language appropriate for formal performance reviews
2. Maintain a positive and constructive tone throughout
3. Reference specific metrics from the assessment (score, accuracy, time)
4. Acknowledge the employee's strengths based on their performance category
5. Provide 2-3 specific, actionable improvement suggestions
6. If performance improved from previous assessments, acknowledge this growth
7. Keep the feedback between 100-150 words
8. Address the employee by their name: {context['employeeName']}
9. End with an encouraging forward-looking statement

=== Output Format ===
Write a single paragraph of professional performance feedback that meets all the above requirements.

Feedback:"""
        
        return prompt
    
    def generate(self, context):
        """
        Generate feedback using Gemini API
        
        Args:
            context (dict): Assessment context
            
        Returns:
            str: Generated feedback text
        """
        if self.client is None:
            return self._generate_template(context)
        
        try:
            prompt = self.build_prompt(context)
            response = self.client.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._generate_template(context)
    
    def _generate_template(self, context):
        """
        Template-based fallback feedback generator
        Used when Gemini API is unavailable
        """
        import random
        
        name = context.get('employeeName', 'The employee')
        quiz = context.get('quizTitle', 'the assessment')
        score = context.get('score', 0)
        total = context.get('totalQuestions', 5)
        accuracy = context.get('accuracy', 0)
        category = context.get('performanceCategory', 'Average Performer')
        time_taken = context.get('timeTaken', 0)
        prev_perf = context.get('previousPerformance', 0)
        
        score_pct = round((score / total * 100)) if total > 0 else 0
        minutes = time_taken // 60
        improvement = accuracy - prev_perf
        
        templates = {
            'High Performer': [
                f"{name} demonstrated exceptional mastery in '{quiz}', achieving an outstanding {score_pct}% score with {accuracy}% accuracy. "
                f"The assessment was completed efficiently in {minutes} minutes, reflecting both deep subject knowledge and excellent time management. "
                f"{'Notably, performance improved by ' + str(round(improvement)) + '% compared to previous assessments, indicating consistent professional growth.' if improvement > 0 else 'This high level of performance demonstrates consistent expertise.'} "
                f"Recommendation: Consider pursuing advanced certifications and mentoring peers to further develop leadership capabilities.",
                
                f"Outstanding performance by {name} on the '{quiz}' assessment. With {accuracy}% accuracy and a {score_pct}% score ratio, "
                f"this result demonstrates comprehensive understanding of the subject matter. "
                f"{'A significant ' + str(round(improvement)) + '% improvement over previous scores marks excellent progress.' if improvement > 5 else ''} "
                f"Moving forward, exploring specialized projects and knowledge-sharing opportunities would be excellent career development steps."
            ],
            'Average Performer': [
                f"{name} completed '{quiz}' with a solid {score_pct}% score and {accuracy}% accuracy, finished in {minutes} minutes. "
                f"This demonstrates adequate understanding of core concepts covered in this assessment. "
                f"{'The ' + str(round(improvement)) + '% improvement from previous assessments shows dedication to growth.' if improvement > 0 else ''} "
                f"To reach the next level, focusing on advanced problem-solving techniques and reviewing areas where questions were missed would be beneficial. "
                f"Regular practice sessions and collaborative learning are recommended for continued development.",
                
                f"Good effort by {name} on '{quiz}', achieving {accuracy}% accuracy with a completion time of {minutes} minutes. "
                f"The {score_pct}% score indicates a solid foundation with room for enhancement. "
                f"Targeted areas for improvement include deeper exploration of advanced topics and more consistent practice. "
                f"Consider scheduling regular review sessions and engaging with team leads on challenging concepts to strengthen overall competency."
            ],
            'Needs Improvement': [
                f"{name} has completed the '{quiz}' assessment with a {score_pct}% score and {accuracy}% accuracy. "
                f"While the effort to complete the assessment in {minutes} minutes is noted, there are clear opportunities for skill enhancement. "
                f"{'A ' + str(round(improvement)) + '% improvement from previous attempts demonstrates potential and willingness to grow.' if improvement > 0 else 'A structured improvement plan is recommended.'} "
                f"Immediate action items include scheduling a one-on-one with a team lead, enrolling in foundational training courses, "
                f"and dedicating additional time to practice exercises. With focused effort and the right support, substantial improvement is achievable.",
                
                f"Results from '{quiz}' indicate areas requiring focused development for {name}. "
                f"With {accuracy}% accuracy, there is significant room for growth. "
                f"Recommended development plan: 1) Review all incorrect answers with a mentor, "
                f"2) Complete supplementary learning modules, 3) Schedule bi-weekly check-ins with supervisor, "
                f"4) Practice with similar quiz formats regularly. This structured approach will build confidence progressively."
            ]
        }
        
        category_templates = templates.get(category, templates['Average Performer'])
        return random.choice(category_templates)


def generate_employee_feedback(context):
    """
    Main function to generate employee feedback
    
    Args:
        context (dict): Assessment context with required fields
    
    Returns:
        str: Generated feedback text (100-150 words)
    
    Example usage:
        context = {
            'employeeName': 'John Doe',
            'quizTitle': 'JavaScript Fundamentals',
            'score': 4,
            'totalQuestions': 5,
            'accuracy': 80.0,
            'timeTaken': 450,
            'performanceCategory': 'High Performer',
            'previousPerformance': 75.0
        }
        feedback = generate_employee_feedback(context)
        print(feedback)
    """
    generator = FeedbackGenerator()
    return generator.generate(context)


# Example usage and testing
if __name__ == '__main__':
    print("=" * 60)
    print("GENERATIVE AI FEEDBACK GENERATOR")
    print("Using Google Gemini API with Prompt Engineering")
    print("=" * 60)
    
    # Test cases
    test_cases = [
        {
            'employeeName': 'Sarah Johnson',
            'quizTitle': 'JavaScript Fundamentals',
            'score': 5,
            'totalQuestions': 5,
            'accuracy': 95.0,
            'timeTaken': 420,
            'performanceCategory': 'High Performer',
            'previousPerformance': 85.0
        },
        {
            'employeeName': 'Michael Chen',
            'quizTitle': 'Python Programming Basics',
            'score': 3,
            'totalQuestions': 5,
            'accuracy': 65.0,
            'timeTaken': 780,
            'performanceCategory': 'Average Performer',
            'previousPerformance': 60.0
        },
        {
            'employeeName': 'Emily Rodriguez',
            'quizTitle': 'Data Structures & Algorithms',
            'score': 2,
            'totalQuestions': 5,
            'accuracy': 40.0,
            'timeTaken': 1200,
            'performanceCategory': 'Needs Improvement',
            'previousPerformance': 45.0
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n{'─' * 60}")
        print(f"Test Case {i}: {test['employeeName']} - {test['performanceCategory']}")
        print(f"{'─' * 60}")
        print(f"Quiz: {test['quizTitle']}")
        print(f"Score: {test['score']}/{test['totalQuestions']}")
        print(f"Accuracy: {test['accuracy']}%")
        print(f"\nGenerated Feedback:")
        feedback = generate_employee_feedback(test)
        print(feedback)
        print(f"\nWord count: {len(feedback.split())}")
    
    print(f"\n{'=' * 60}")
    print("Feedback generation complete!")
    print(f"{'=' * 60}")
