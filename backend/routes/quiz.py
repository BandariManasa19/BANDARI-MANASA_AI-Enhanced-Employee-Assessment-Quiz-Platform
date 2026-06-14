# Quiz Management Routes
# Handles CRUD operations for quizzes and questions

from flask import Blueprint, request, jsonify, session
from backend.database import execute_query
from backend.routes.auth import login_required, admin_required
import uuid

quiz_bp = Blueprint('quiz', __name__)


# ============ QUIZ ENDPOINTS ============

@quiz_bp.route('/quizzes', methods=['GET'])
@login_required
def get_quizzes():
    """Get all active quizzes"""
    quizzes = execute_query(
        """SELECT id, title, category, duration, total_questions, created_by, created_at, is_active 
           FROM quizzes WHERE is_active = TRUE ORDER BY created_at DESC""",
        fetch=True
    )
    
    if quizzes is None:
        quizzes = []
    
    return jsonify({
        'quizzes': [{
            'id': q['id'],
            'title': q['title'],
            'category': q['category'],
            'duration': q['duration'],
            'totalQuestions': q['total_questions'],
            'createdBy': q['created_by'],
            'createdAt': q['created_at'].isoformat() if q['created_at'] else None,
            'isActive': bool(q['is_active'])
        } for q in quizzes]
    }), 200


@quiz_bp.route('/quiz/create', methods=['POST'])
@admin_required
def create_quiz():
    """
    Create a new quiz (Admin only)
    Required fields: title, category, duration, totalQuestions
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    required_fields = ['title', 'category', 'duration', 'totalQuestions']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    quiz_id = str(uuid.uuid4())
    
    execute_query(
        """INSERT INTO quizzes (id, title, category, duration, total_questions, created_by, is_active) 
           VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (quiz_id, data['title'], data['category'], data['duration'],
         data['totalQuestions'], session['user_id'], True)
    )
    
    return jsonify({
        'message': 'Quiz created successfully',
        'quiz': {
            'id': quiz_id,
            'title': data['title'],
            'category': data['category'],
            'duration': data['duration'],
            'totalQuestions': data['totalQuestions'],
            'isActive': True
        }
    }), 201


@quiz_bp.route('/quiz/update/<quiz_id>', methods=['PUT'])
@admin_required
def update_quiz(quiz_id):
    """Update an existing quiz (Admin only)"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Check if quiz exists
    existing = execute_query(
        "SELECT id FROM quizzes WHERE id = %s", (quiz_id,), fetch=True
    )
    if not existing:
        return jsonify({'error': 'Quiz not found'}), 404
    
    # Build update query dynamically
    updates = []
    params = []
    
    if 'title' in data:
        updates.append("title = %s")
        params.append(data['title'])
    if 'category' in data:
        updates.append("category = %s")
        params.append(data['category'])
    if 'duration' in data:
        updates.append("duration = %s")
        params.append(data['duration'])
    if 'totalQuestions' in data:
        updates.append("total_questions = %s")
        params.append(data['totalQuestions'])
    if 'isActive' in data:
        updates.append("is_active = %s")
        params.append(data['isActive'])
    
    if not updates:
        return jsonify({'error': 'No fields to update'}), 400
    
    params.append(quiz_id)
    query = f"UPDATE quizzes SET {', '.join(updates)} WHERE id = %s"
    execute_query(query, tuple(params))
    
    return jsonify({'message': 'Quiz updated successfully'}), 200


@quiz_bp.route('/quiz/delete/<quiz_id>', methods=['DELETE'])
@admin_required
def delete_quiz(quiz_id):
    """Delete a quiz and its questions (Admin only)"""
    # Delete questions first (foreign key constraint)
    execute_query(
        "DELETE FROM questions WHERE quiz_id = %s", (quiz_id,)
    )
    
    # Delete quiz
    result = execute_query(
        "DELETE FROM quizzes WHERE id = %s", (quiz_id,)
    )
    
    return jsonify({'message': 'Quiz deleted successfully'}), 200


# ============ QUESTION ENDPOINTS ============

@quiz_bp.route('/question/add', methods=['POST'])
@admin_required
def add_question():
    """
    Add a question to a quiz (Admin only)
    Required fields: quizId, question, optionA, optionB, optionC, optionD, correctAnswer
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    required_fields = ['quizId', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    if data['correctAnswer'] not in ['A', 'B', 'C', 'D']:
        return jsonify({'error': 'correctAnswer must be A, B, C, or D'}), 400
    
    question_id = str(uuid.uuid4())
    
    execute_query(
        """INSERT INTO questions (id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer) 
           VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
        (question_id, data['quizId'], data['question'], data['optionA'],
         data['optionB'], data['optionC'], data['optionD'], data['correctAnswer'])
    )
    
    return jsonify({
        'message': 'Question added successfully',
        'questionId': question_id
    }), 201


@quiz_bp.route('/question/update/<question_id>', methods=['PUT'])
@admin_required
def update_question(question_id):
    """Update an existing question (Admin only)"""
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    updates = []
    params = []
    
    field_mapping = {
        'question': 'question',
        'optionA': 'option_a',
        'optionB': 'option_b',
        'optionC': 'option_c',
        'optionD': 'option_d',
        'correctAnswer': 'correct_answer'
    }
    
    for key, db_field in field_mapping.items():
        if key in data:
            updates.append(f"{db_field} = %s")
            params.append(data[key])
    
    if not updates:
        return jsonify({'error': 'No fields to update'}), 400
    
    params.append(question_id)
    query = f"UPDATE questions SET {', '.join(updates)} WHERE id = %s"
    execute_query(query, tuple(params))
    
    return jsonify({'message': 'Question updated successfully'}), 200


@quiz_bp.route('/question/delete/<question_id>', methods=['DELETE'])
@admin_required
def delete_question(question_id):
    """Delete a question (Admin only)"""
    execute_query(
        "DELETE FROM questions WHERE id = %s", (question_id,)
    )
    return jsonify({'message': 'Question deleted successfully'}), 200


@quiz_bp.route('/quiz/<quiz_id>/questions', methods=['GET'])
@login_required
def get_quiz_questions(quiz_id):
    """Get all questions for a specific quiz"""
    questions = execute_query(
        """SELECT id, quiz_id, question, option_a, option_b, option_c, option_d, correct_answer 
           FROM questions WHERE quiz_id = %s""",
        (quiz_id,),
        fetch=True
    )
    
    if questions is None:
        questions = []
    
    return jsonify({
        'questions': [{
            'id': q['id'],
            'quizId': q['quiz_id'],
            'question': q['question'],
            'optionA': q['option_a'],
            'optionB': q['option_b'],
            'optionC': q['option_c'],
            'optionD': q['option_d'],
            'correctAnswer': q['correct_answer']
        } for q in questions]
    }), 200
