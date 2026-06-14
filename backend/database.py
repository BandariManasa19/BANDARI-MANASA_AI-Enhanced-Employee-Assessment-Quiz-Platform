# Database connection and management module
# Handles MySQL connection pool and query execution

import mysql.connector
from mysql.connector import pooling
from backend.config import Config

# Create connection pool for better performance
db_config = {
    'host': Config.MYSQL_HOST,
    'user': Config.MYSQL_USER,
    'password': Config.MYSQL_PASSWORD,
    'database': Config.MYSQL_DB,
    'port': Config.MYSQL_PORT,
    'pool_name': 'mypool',
    'pool_size': 10,
    'pool_reset_session': True
}

# Connection pool instance
connection_pool = None


def init_db():
    """Initialize the database connection pool"""
    global connection_pool
    try:
        connection_pool = pooling.MySQLConnectionPool(**db_config)
        print("Database connection pool created successfully")
        return True
    except Exception as e:
        print(f"Error creating connection pool: {e}")
        return False


def get_connection():
    """Get a connection from the pool"""
    global connection_pool
    if connection_pool is None:
        init_db()
    try:
        return connection_pool.get_connection()
    except Exception as e:
        print(f"Error getting connection: {e}")
        return None


def execute_query(query, params=None, fetch=False):
    """
    Execute a SQL query
    Args:
        query: SQL query string
        params: Query parameters tuple
        fetch: Whether to fetch results
    Returns:
        Query results if fetch=True, otherwise None
    """
    connection = get_connection()
    if connection is None:
        return None
    
    cursor = None
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())
        
        if fetch:
            results = cursor.fetchall()
            return results
        else:
            connection.commit()
            return cursor.lastrowid
    except Exception as e:
        print(f"Query execution error: {e}")
        connection.rollback()
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def execute_many(query, params_list):
    """Execute a query with multiple parameter sets"""
    connection = get_connection()
    if connection is None:
        return None
    
    cursor = None
    try:
        cursor = connection.cursor()
        cursor.executemany(query, params_list)
        connection.commit()
        return cursor.rowcount
    except Exception as e:
        print(f"Batch execution error: {e}")
        connection.rollback()
        return None
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
