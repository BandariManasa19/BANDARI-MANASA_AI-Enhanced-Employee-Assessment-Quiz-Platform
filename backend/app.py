# Main Flask Application
# AI-Enhanced Employee Quiz & Assessment Platform Backend

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from functools import wraps
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import Config
from backend.database import init_db, execute_query
from backend.routes.auth import auth_bp
from backend.routes.quiz import quiz_bp
from backend.routes.assessment import assessment_bp
from backend.routes.ml_routes import ml_bp
from backend.routes.genai_routes import genai_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object(Config)
    app.config['SESSION_TYPE'] = 'filesystem'
    
    # Enable CORS for frontend communication
    CORS(app, supports_credentials=True)
    
    # Initialize database
    init_db()
    
    # Register blueprints (route modules)
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(quiz_bp, url_prefix='/api')
    app.register_blueprint(assessment_bp, url_prefix='/api')
    app.register_blueprint(ml_bp, url_prefix='/api')
    app.register_blueprint(genai_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'AI-Enhanced Employee Assessment Platform API is running',
            'version': '1.0.0'
        })
    
    # API documentation endpoint
    @app.route('/api/docs', methods=['GET'])
    def api_docs():
        return jsonify({
            'name': 'AI-Enhanced Employee Assessment Platform API',
            'version': '1.0.0',
            'endpoints': {
                'authentication': {
                    'POST /api/register': 'Register new employee',
                    'POST /api/login': 'Login employee/admin',
                    'POST /api/logout': 'Logout current user',
                    'GET /api/profile': 'Get current user profile'
                },
                'quiz': {
                    'GET /api/quizzes': 'Get all quizzes',
                    'POST /api/quiz/create': 'Create new quiz',
                    'PUT /api/quiz/update/<id>': 'Update quiz',
                    'DELETE /api/quiz/delete/<id>': 'Delete quiz',
                    'POST /api/question/add': 'Add question to quiz',
                    'PUT /api/question/update/<id>': 'Update question',
                    'DELETE /api/question/delete/<id>': 'Delete question'
                },
                'assessment': {
                    'POST /api/quiz/submit': 'Submit quiz attempt',
                    'GET /api/results': 'Get all results',
                    'GET /api/history': 'Get assessment history'
                },
                'machine_learning': {
                    'POST /api/predict-performance': 'Predict employee performance'
                },
                'generative_ai': {
                    'POST /api/generate-feedback': 'Generate AI feedback'
                }
            }
        })
    
    return app


# Create application instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
