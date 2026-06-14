# Generative AI Routes
# Handles AI-powered feedback generation using Google Gemini API

from flask import Blueprint, request, jsonify, session
from backend.database import execute_query
from backend.routes.auth import login_required
from backend.config import Config
import uuid

genai_bp = Blueprint('genai', __name__)

# Gemini API client (lazy initialization)
gemini_client = None


def init_gemini():
    """Initialize Gemini API client"""
    global gemini_client
    try:
        import google.generativeai as genai
        genai.configure(api_key=Config.GEMINI_API_KEY)
        gemini_client = genai.GenerativeModel(Config.GEMINI_MODEL)
        print("Gemini API initialized successfully")
        return True
    except ImportError:
        print("google-generativeai package not installed. Using template feedback.")
        return False
    except Exception as e:
        print(f"Error initializing Gemini API: {e}")
        return False


def generate_template_feedback(context):
    """
    Generate feedback using templates when Gemini API is unavailable
    Uses professional HR language with personalized content
    """
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
            f"{name} demonstrated exceptional performance in '{quiz}', achieving {score_pct}% with {accuracy}% accuracy. "
            f"Completed efficiently in {minutes} minutes, reflecting strong expertise and excellent time management. "
            f"{'Notable improvement of ' + str(round(improvement)) + '% from previous assessments shows consistent growth.' if improvement > 0 else 'Consistent high performance maintained.'} "
            f"Recommendation: Consider mentoring junior team members and pursuing advanced certifications.",
            
            f"Outstanding work by {name} on '{quiz}'. With {accuracy}% accuracy and swift completion, "
            f"this performance demonstrates deep subject matter understanding. "
            f"{'A ' + str(round(improvement)) + '% improvement marks positive trajectory.' if improvement > 5 else ''} "
            f"Moving forward, exploring leadership opportunities would further leverage this expertise."
        ],
        'Average Performer': [
            f"{name} completed '{quiz}' with {score_pct}% score and {accuracy}% accuracy in {minutes} minutes. "
            f"This reflects solid understanding of core concepts. "
            f"{'The ' + str(round(improvement)) + '% improvement from previous attempts is encouraging.' if improvement > 0 else ''} "
            f"To enhance performance, focus on advanced problem-solving and review missed areas. "
            f"Regular practice sessions and peer study groups are recommended.",
            
            f"Good effort by {name} on '{quiz}', achieving {accuracy}% accuracy. "
            f"The foundational knowledge is adequate with room for growth. "
            f"Targeted improvement areas include deeper topic exploration and consistent practice. "
            f"Consider scheduling review sessions and seeking guidance on challenging topics."
        ],
        'Needs Improvement': [
            f"{name} completed '{quiz}' with {score_pct}% score and {accuracy}% accuracy. "
            f"While effort is noted, there are significant opportunities for skill enhancement. "
            f"{'A ' + str(round(improvement)) + '% improvement from previous attempts shows potential.' if improvement > 0 else 'A structured improvement plan is recommended.'} "
            f"Immediate actions: schedule mentorship sessions, enroll in foundational courses, "
            f"and dedicate additional practice time. Substantial improvement is achievable with focused effort.",
            
            f"Results for {name} on '{quiz}' indicate areas requiring focused attention. "
            f"With {accuracy}% accuracy, there is room for meaningful growth. "
            f"Recommended plan: 1) Review incorrect answers with mentor, 2) Complete supplementary modules, "
            f"3) Schedule bi-weekly check-ins, 4) Practice with similar formats. "
            f"The organization supports {name}'s development through available resources."
        ]
    }
    
    import random
    category_templates = templates.get(category, templates['Average Performer'])
    return random.choice(category_templates)


@genai_bp.route('/generate-feedback', methods=['POST'])
@login_required
def generate_feedback():
    """
    Generate personalized feedback using Gemini AI
    Required fields: score, totalQuestions, accuracy, timeTaken, 
                    performanceCategory, previousPerformance, quizTitle
    """
    global gemini_client
    
    data = request.get_json()
    user_id = session['user_id']
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Get employee name
    employee = execute_query(
        "SELECT name FROM employees WHERE id = %s",
        (user_id,), fetch=True
    )
    employee_name = employee[0]['name'] if employee else 'Employee'
    
    context = {
        'employeeName': employee_name,
        'score': data.get('score', 0),
        'totalQuestions': data.get('totalQuestions', 5),
        'accuracy': data.get('accuracy', 0),
        'timeTaken': data.get('timeTaken', 0),
        'performanceCategory': data.get('performanceCategory', 'Average Performer'),
        'previousPerformance': data.get('previousPerformance', 0),
        'quizTitle': data.get('quizTitle', 'Assessment')
    }
    
    feedback_text = None
    
    # Try Gemini API first
    if gemini_client is None:
        init_gemini()
    
    if gemini_client is not None:
        try:
            # Construct prompt for Gemini
            prompt = f"""Generate personalized employee performance feedback based on the following assessment data:

Employee Name: {context['employeeName']}
Quiz Title: {context['quizTitle']}
Score: {context['score']}/{context['totalQuestions']} ({round(context['score']/context['totalQuestions']*100)}%)
Accuracy: {context['accuracy']}%
Time Taken: {context['timeTaken']} seconds
Performance Category: {context['performanceCategory']}
Previous Performance Average: {context['previousPerformance']}%

Requirements:
- Professional HR language
- Positive and constructive tone
- Include specific improvement suggestions
- 100-150 words
- Address the employee by name
- Reference specific metrics from the assessment
- Provide actionable next steps

Generate the feedback:"""
            
            response = gemini_client.generate_content(prompt)
            feedback_text = response.text
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            feedback_text = None
    
    # Fallback to template if Gemini fails
    if feedback_text is None:
        feedback_text = generate_template_feedback(context)
    
    # Store feedback in database
    feedback_id = str(uuid.uuid4())
    attempt_id = data.get('attemptId', '')
    
    execute_query(
        """INSERT INTO feedbacks (id, attempt_id, employee_id, content)
           VALUES (%s, %s, %s, %s)""",
        (feedback_id, attempt_id, user_id, feedback_text)
    )
    
    return jsonify({
        'feedback': {
            'id': feedback_id,
            'content': feedback_text,
            'generatedBy': 'Gemini AI' if gemini_client else 'Template Engine',
            'attemptId': attempt_id
        }
    }), 200
