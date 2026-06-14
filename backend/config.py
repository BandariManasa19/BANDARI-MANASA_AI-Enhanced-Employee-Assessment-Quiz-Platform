# Configuration file for the Employee Assessment Platform
# Contains all application settings and environment variables

import os
from datetime import timedelta


class Config:
    """Base configuration class"""

    SECRET_KEY = os.environ.get("SECRET_KEY", "employee-assessment-secret-key-2024")

    # MySQL Database Configuration
    MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
    MYSQL_USER = os.environ.get("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
    MYSQL_DB = os.environ.get("MYSQL_DB", "employee_assessment")
    MYSQL_PORT = int(os.environ.get("MYSQL_PORT", "3306"))

    # Google Gemini API Configuration
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "your-gemini-api-key-here")
    GEMINI_MODEL = "gemini-pro"

    # ML Model Configuration
    ML_MODEL_PATH = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "ml", "employee_model.pkl"
    )
    ML_DATASET_PATH = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "ml",
        "dataset",
        "employee_performance.csv",
    )

    # Session Configuration
    SESSION_TYPE = "filesystem"
    PERMANENT_SESSION_LIFETIME = timedelta(seconds=86400)  # 24 hours


class DevelopmentConfig(Config):
    """Development configuration"""

    DEBUG = True
    MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "root")


class ProductionConfig(Config):
    """Production configuration"""

    DEBUG = False


# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
