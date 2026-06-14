# ML Model Training Script
# Trains a Random Forest Classifier for Employee Performance Prediction
# 
# Usage: python ml/train_model.py
# 
# This script:
# 1. Loads the synthetic dataset (1000+ records)
# 2. Preprocesses the data
# 3. Trains a Random Forest Classifier
# 4. Evaluates the model
# 5. Saves the model as employee_model.pkl

import os
import sys
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def generate_dataset(n_samples=1000):
    """
    Generate synthetic employee performance dataset
    Creates balanced data across three performance categories
    """
    np.random.seed(42)
    
    data = []
    samples_per_class = n_samples // 3
    
    # High Performers
    for _ in range(samples_per_class):
        score = np.random.uniform(75, 100)
        accuracy = np.random.uniform(80, 100)
        time_taken = np.random.uniform(300, 900)
        attempts = np.random.choice([1, 2], p=[0.7, 0.3])
        previous_performance = np.random.uniform(70, 100)
        data.append([score, accuracy, time_taken, attempts, previous_performance, 'High Performer'])
    
    # Average Performers
    for _ in range(samples_per_class):
        score = np.random.uniform(50, 80)
        accuracy = np.random.uniform(55, 85)
        time_taken = np.random.uniform(400, 1200)
        attempts = np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2])
        previous_performance = np.random.uniform(50, 80)
        data.append([score, accuracy, time_taken, attempts, previous_performance, 'Average Performer'])
    
    # Needs Improvement
    for _ in range(n_samples - 2 * samples_per_class):
        score = np.random.uniform(20, 55)
        accuracy = np.random.uniform(25, 60)
        time_taken = np.random.uniform(600, 1500)
        attempts = np.random.choice([1, 2, 3, 4], p=[0.2, 0.3, 0.3, 0.2])
        previous_performance = np.random.uniform(30, 60)
        data.append([score, accuracy, time_taken, attempts, previous_performance, 'Needs Improvement'])
    
    df = pd.DataFrame(data, columns=[
        'score', 'accuracy', 'time_taken', 'attempts', 
        'previous_performance', 'performance_category'
    ])
    
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    return df


def save_dataset(df, path):
    """Save dataset to CSV"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"Dataset saved to {path}")
    print(f"Dataset shape: {df.shape}")
    print(f"\nClass distribution:")
    print(df['performance_category'].value_counts())


def preprocess_data(df):
    """
    Preprocess the dataset:
    1. Handle missing values
    2. Encode labels
    3. Split features and target
    """
    # Check for missing values
    print(f"\nMissing values:\n{df.isnull().sum()}")
    
    # Fill missing values with median for numerical columns
    numerical_cols = ['score', 'accuracy', 'time_taken', 'attempts', 'previous_performance']
    for col in numerical_cols:
        if df[col].isnull().any():
            df[col].fillna(df[col].median(), inplace=True)
    
    # Encode target labels
    label_encoder = LabelEncoder()
    df['encoded_category'] = label_encoder.fit_transform(df['performance_category'])
    
    # Features and target
    X = df[numerical_cols].values
    y = df['encoded_category'].values
    
    return X, y, label_encoder


def train_model(X_train, y_train):
    """
    Train Random Forest Classifier
    Using optimized hyperparameters for employee performance prediction
    """
    model = RandomForestClassifier(
        n_estimators=100,        # Number of trees
        max_depth=10,            # Maximum tree depth
        min_samples_split=5,     # Minimum samples to split
        min_samples_leaf=2,      # Minimum samples in leaf
        max_features='sqrt',     # Features considered at each split
        random_state=42,         # Reproducibility
        n_jobs=-1                # Use all CPU cores
    )
    
    model.fit(X_train, y_train)
    print("\nModel training completed!")
    
    return model


def evaluate_model(model, X_test, y_test, label_encoder):
    """
    Evaluate the trained model:
    - Accuracy
    - Classification Report
    - Confusion Matrix
    """
    y_pred = model.predict(X_test)
    
    # Accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{'='*50}")
    print(f"MODEL EVALUATION RESULTS")
    print(f"{'='*50}")
    print(f"\nAccuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
    
    # Classification Report
    target_names = label_encoder.classes_
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    print(f"Confusion Matrix:")
    print(cm)
    
    # Feature Importance
    feature_names = ['score', 'accuracy', 'time_taken', 'attempts', 'previous_performance']
    importances = model.feature_importances_
    print(f"\nFeature Importance:")
    for name, imp in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
        print(f"  {name}: {imp:.4f}")
    
    return accuracy


def save_model(model, label_encoder, path):
    """Save the trained model using joblib"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    
    # Save both model and label encoder
    model_data = {
        'model': model,
        'label_encoder': label_encoder,
        'feature_names': ['score', 'accuracy', 'time_taken', 'attempts', 'previous_performance'],
        'class_names': ['High Performer', 'Average Performer', 'Needs Improvement']
    }
    
    joblib.dump(model_data, path)
    print(f"\nModel saved to {path}")
    print(f"Model file size: {os.path.getsize(path) / 1024:.2f} KB")


def main():
    """Main training pipeline"""
    print("="*50)
    print("EMPLOYEE PERFORMANCE PREDICTION MODEL TRAINING")
    print("Algorithm: Random Forest Classifier")
    print("="*50)
    
    # Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(base_dir, 'dataset', 'employee_performance.csv')
    model_path = os.path.join(base_dir, 'employee_model.pkl')
    
    # Step 1: Generate Dataset
    print("\n[Step 1/7] Generating synthetic dataset...")
    df = generate_dataset(1000)
    save_dataset(df, dataset_path)
    
    # Step 2: Preprocess Data
    print("\n[Step 2/7] Preprocessing data...")
    X, y, label_encoder = preprocess_data(df)
    
    # Step 3: Train-Test Split
    print("\n[Step 3/7] Splitting data (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"Training set: {X_train.shape[0]} samples")
    print(f"Testing set: {X_test.shape[0]} samples")
    
    # Step 4: Train Model
    print("\n[Step 4/7] Training Random Forest Classifier...")
    model = train_model(X_train, y_train)
    
    # Step 5: Evaluate Model
    print("\n[Step 5/7] Evaluating model...")
    accuracy = evaluate_model(model, X_test, y_test, label_encoder)
    
    # Step 6: Save Model
    print("\n[Step 6/7] Saving model...")
    save_model(model, label_encoder, model_path)
    
    # Step 7: Summary
    print(f"\n[Step 7/7] Training Complete!")
    print(f"{'='*50}")
    print(f"Final Model Accuracy: {accuracy*100:.2f}%")
    print(f"Model saved at: {model_path}")
    print(f"Dataset saved at: {dataset_path}")
    print(f"{'='*50}")


if __name__ == '__main__':
    main()
