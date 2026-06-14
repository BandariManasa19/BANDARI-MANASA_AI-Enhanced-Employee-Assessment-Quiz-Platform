# Authentication Routes
# Handles employee registration, login, logout, and session management

from flask import Blueprint, request, jsonify, session
from backend.database import execute_query
import hashlib
import uuid

auth_bp = Blueprint("auth", __name__)


def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


# Authentication middleware decorator
def login_required(f):
    """Decorator to require authentication for routes"""
    from functools import wraps

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)

    return decorated_function


def admin_required(f):
    """Decorator to require admin role for routes"""
    from functools import wraps

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        if session.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)

    return decorated_function


@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new employee
    Required fields: employeeId, name, email, password, department
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Validate required fields
    required_fields = ["employeeId", "name", "email", "password", "department"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # Check if email already exists
    existing = execute_query(
        "SELECT id FROM employees WHERE email = %s", (data["email"],), fetch=True
    )
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Check if employee ID already exists
    existing_id = execute_query(
        "SELECT id FROM employees WHERE employee_id = %s",
        (data["employeeId"],),
        fetch=True,
    )
    if existing_id:
        return jsonify({"error": "Employee ID already registered"}), 409

    # Insert new employee
    employee_id = str(uuid.uuid4())
    hashed_pw = hash_password(data["password"])

    execute_query(
        """INSERT INTO employees (id, employee_id, name, email, password, department, role) 
           VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (
            employee_id,
            data["employeeId"],
            data["name"],
            data["email"],
            hashed_pw,
            data["department"],
            "employee",
        ),
    )

    # Set session
    session["user_id"] = employee_id
    session["role"] = "employee"

    return jsonify(
        {
            "message": "Registration successful",
            "user": {
                "id": employee_id,
                "employeeId": data["employeeId"],
                "name": data["name"],
                "email": data["email"],
                "department": data["department"],
                "role": "employee",
            },
        }
    ), 201


@auth_bp.route("/admin/register", methods=["POST"])
@admin_required
def admin_register():
    """
    Register a new admin (Admin only)
    Required fields: employeeId, name, email, password, department
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Validate required fields
    required_fields = ["employeeId", "name", "email", "password", "department"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"{field} is required"}), 400

    # Check if email already exists
    existing = execute_query(
        "SELECT id FROM employees WHERE email = %s", (data["email"],), fetch=True
    )
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Check if employee ID already exists
    existing_id = execute_query(
        "SELECT id FROM employees WHERE employee_id = %s",
        (data["employeeId"],),
        fetch=True,
    )
    if existing_id:
        return jsonify({"error": "Employee ID already registered"}), 409

    # Insert new admin
    employee_id = str(uuid.uuid4())
    hashed_pw = hash_password(data["password"])

    execute_query(
        """INSERT INTO employees (id, employee_id, name, email, password, department, role) 
           VALUES (%s, %s, %s, %s, %s, %s, %s)""",
        (
            employee_id,
            data["employeeId"],
            data["name"],
            data["email"],
            hashed_pw,
            data["department"],
            "admin",
        ),
    )

    return jsonify(
        {
            "message": "Admin registration successful",
            "user": {
                "id": employee_id,
                "employeeId": data["employeeId"],
                "name": data["name"],
                "email": data["email"],
                "department": data["department"],
                "role": "admin",
            },
        }
    ), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login employee or admin
    Required fields: email, password
    """
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Email and password are required"}), 400

    hashed_pw = hash_password(data["password"])

    # Find user by email
    user = execute_query(
        """SELECT id, employee_id, name, email, department, role 
           FROM employees WHERE email = %s AND password = %s""",
        (data["email"], hashed_pw),
        fetch=True,
    )

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    user = user[0]

    # Set session
    session["user_id"] = user["id"]
    session["role"] = user["role"]
    session.permanent = True

    return jsonify(
        {
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "employeeId": user["employee_id"],
                "name": user["name"],
                "email": user["email"],
                "department": user["department"],
                "role": user["role"],
            },
        }
    ), 200


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Logout current user by clearing session"""
    session.clear()
    return jsonify({"message": "Logout successful"}), 200


@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    """Get current user profile (requires authentication)"""
    if "user_id" not in session:
        return jsonify({"error": "Not authenticated"}), 401

    user = execute_query(
        """SELECT id, employee_id, name, email, department, role, created_at 
           FROM employees WHERE id = %s""",
        (session["user_id"],),
        fetch=True,
    )

    if not user:
        session.clear()
        return jsonify({"error": "User not found"}), 404

    user = user[0]
    return jsonify(
        {
            "user": {
                "id": user["id"],
                "employeeId": user["employee_id"],
                "name": user["name"],
                "email": user["email"],
                "department": user["department"],
                "role": user["role"],
                "createdAt": user["created_at"].isoformat()
                if user["created_at"]
                else None,
            }
        }
    ), 200


# Authentication middleware decorator
def login_required(f):
    """Decorator to require authentication for routes"""
    from functools import wraps

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)

    return decorated_function


def admin_required(f):
    """Decorator to require admin role for routes"""
    from functools import wraps

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"error": "Authentication required"}), 401
        if session.get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)

    return decorated_function
