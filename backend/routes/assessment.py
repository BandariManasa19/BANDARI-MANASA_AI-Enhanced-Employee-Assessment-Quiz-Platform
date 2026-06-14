# Assessment Routes
# Handles quiz submissions, results, and history

from flask import Blueprint, request, jsonify, session
from backend.database import execute_query
from backend.routes.auth import login_required
import uuid
from datetime import datetime

assessment_bp = Blueprint('assessment', __name__)


@assessment_bp.route('/quiz/submit', methods=['POST'])
@login_required
def submit_quiz():
    """
    Submit a quiz attempt
    Required fields: quizId, answers (list of {questionId, selectedAnswer}), timeTaken
    """
    data = request.get_json()
    user_id = session['user_id']
    
    if not data or 'quizId' not in data or 'answers' not in data:
        return jsonify({'error': 'Quiz ID and answers are required'}), 400
    
    quiz_id = data['quizId']
    answers = data['answers']
    time_taken = data.get('timeTaken', 0)
    
    # Get quiz details
    quiz = execute_query(
        "SELECT id, title, total_questions, duration FROM quizzes WHERE id = %s",
        (quiz_id,), fetch=True
    )
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    quiz = quiz[0]
    
    # Get correct answers
    questions = execute_query(
        "SELECT id, correct_answer FROM questions WHERE quiz_id = %s",
        (quiz_id,), fetch=True
    )
    
    correct_map = {q['id']: q['correct_answer'] for q in questions}
    
    # Calculate score
    score = 0
    answer_details = []
    for ans in answers:
        question_id = ans.get('questionId')
        selected = ans.get('selectedAnswer', '')
        is_correct = correct_map.get(question_id) == selected
        if is_correct:
            score += 1
        answer_details.append({
            'questionId': question_id,
            'selectedAnswer': selected,
            'isCorrect': is_correct
        })
    
    total_questions = len(questions)
    accuracy = round((score / total_questions * 100), 1) if total_questions > 0 else 0
    
    # Get attempt count
    prev_attempts = execute_query(
        "SELECT COUNT(*) as count FROM quiz_attempts WHERE employee_id = %s AND quiz_id = %s",
        (user_id, quiz_id), fetch=True
    )
    attempt_number = (prev_attempts[0]['count'] if prev_attempts else 0) + 1
    
    # Store attempt
    attempt_id = str(uuid.uuid4())
    now = datetime.now()
    
    execute_query(
        """INSERT INTO quiz_attempts 
           (id, employee_id, quiz_id, start_time, end_time, score, total_questions, accuracy, time_taken, attempt_number) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
        (attempt_id, user_id, quiz_id, 
         data.get('startTime', now), now,
         score, total_questions, accuracy, time_taken, attempt_number)
    )
    
    # Store individual answers
    for ans in answer_details:
        execute_query(
            """INSERT INTO quiz_answers (id, attempt_id, question_id, selected_answer, is_correct)
               VALUES (%s, %s, %s, %s, %s)""",
            (str(uuid.uuid4()), attempt_id, ans['questionId'], 
             ans['selectedAnswer'], ans['isCorrect'])
        )
    
    # Get previous performance average
    prev_avg = execute_query(
        "SELECT AVG(accuracy) as avg_acc FROM quiz_attempts WHERE employee_id = %s AND id != %s",
        (user_id, attempt_id), fetch=True
    )
    previous_performance = round(prev_avg[0]['avg_acc'] or 0, 1) if prev_avg else 0
    
    return jsonify({
        'message': 'Quiz submitted successfully',
        'attempt': {
            'id': attempt_id,
            'quizId': quiz_id,
            'quizTitle': quiz['title'],
            'score': score,
            'totalQuestions': total_questions,
            'accuracy': accuracy,
            'timeTaken': time_taken,
            'attemptNumber': attempt_number,
            'answers': answer_details,
            'previousPerformance': previous_performance
        }
    }), 201


@assessment_bp.route('/results', methods=['GET'])
@login_required
def get_results():
    """Get all results for the current user (or all if admin)"""
    user_id = session['user_id']
    is_admin = session.get('role') == 'admin'
    
    if is_admin:
        results = execute_query(
            """SELECT qa.*, q.title as quiz_title, q.category, e.name as employee_name 
               FROM quiz_attempts qa
               JOIN quizzes q ON qa.quiz_id = q.id
               JOIN employees e ON qa.employee_id = e.id
               ORDER BY qa.end_time DESC""",
            fetch=True
        )
    else:
        results = execute_query(
            """SELECT qa.*, q.title as quiz_title, q.category 
               FROM quiz_attempts qa
               JOIN quizzes q ON qa.quiz_id = q.id
               WHERE qa.employee_id = %s
               ORDER BY qa.end_time DESC""",
            (user_id,), fetch=True
        )
    
    if results is None:
        results = []
    
    return jsonify({
        'results': [{
            'id': r['id'],
            'employeeId': r['employee_id'],
            'employeeName': r.get('employee_name'),
            'quizId': r['quiz_id'],
            'quizTitle': r['quiz_title'],
            'category': r['category'],
            'score': r['score'],
            'totalQuestions': r['total_questions'],
            'accuracy': float(r['accuracy']),
            'timeTaken': r['time_taken'],
            'attemptNumber': r['attempt_number'],
            'endTime': r['end_time'].isoformat() if r['end_time'] else None
        } for r in results]
    }), 200


@assessment_bp.route('/history', methods=['GET'])
@login_required
def get_history():
    """Get assessment history for the current user"""
    user_id = session['user_id']
    
    history = execute_query(
        """SELECT qa.*, q.title as quiz_title, q.category 
           FROM quiz_attempts qa
           JOIN quizzes q ON qa.quiz_id = q.id
           WHERE qa.employee_id = %s
           ORDER BY qa.end_time DESC
           LIMIT 50""",
        (user_id,), fetch=True
    )
    
    if history is None:
        history = []
    
    return jsonify({
        'history': [{
            'id': h['id'],
            'quizId': h['quiz_id'],
            'quizTitle': h['quiz_title'],
            'category': h['category'],
            'score': h['score'],
            'totalQuestions': h['total_questions'],
            'accuracy': float(h['accuracy']),
            'timeTaken': h['time_taken'],
            'attemptNumber': h['attempt_number'],
            'endTime': h['end_time'].isoformat() if h['end_time'] else None
        } for h in history]
    }), 200
