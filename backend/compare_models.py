"""
Multi-Model Accuracy Comparison Script
Compares 6 classifiers on the LPU placement dataset
"""
import os, sys
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, precision_score, recall_score
from sklearn.model_selection import train_test_split

sys.path.insert(0, os.path.dirname(__file__))
from model import generate_synthetic_student_data, FEATURE_NAMES

np.random.seed(42)
df = generate_synthetic_student_data(n_samples=2500, random_state=42)
X = df[FEATURE_NAMES]
y = df["placement_ready"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

models = {
    "Random Forest (250 trees)":    RandomForestClassifier(n_estimators=250, max_depth=12, min_samples_split=4, min_samples_leaf=2, class_weight="balanced", random_state=42),
    "Gradient Boosting":            GradientBoostingClassifier(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=42),
    "Decision Tree":                DecisionTreeClassifier(max_depth=8, random_state=42),
    "Logistic Regression":          LogisticRegression(max_iter=1000, random_state=42),
    "K-Nearest Neighbors (k=5)":    KNeighborsClassifier(n_neighbors=5),
    "Support Vector Machine":       SVC(probability=True, kernel="rbf", random_state=42),
    "Naive Bayes":                  GaussianNB(),
    "AdaBoost":                     AdaBoostClassifier(n_estimators=100, random_state=42),
}

print("\n" + "="*90)
print("  MODEL COMPARISON — LPU PLACEMENT INTELLIGENCE (n=2500 synthetic, 80/20 split)")
print("="*90)
print(f"{'Model':<30} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'ROC-AUC':>10}")
print("-"*90)

results = []
for name, clf in models.items():
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]
    acc   = accuracy_score(y_test, y_pred) * 100
    prec  = precision_score(y_test, y_pred, zero_division=0) * 100
    rec   = recall_score(y_test, y_pred, zero_division=0) * 100
    f1    = f1_score(y_test, y_pred, zero_division=0) * 100
    auc   = roc_auc_score(y_test, y_prob)
    results.append((name, acc, prec, rec, f1, auc))
    print(f"{name:<30} {acc:>9.2f}% {prec:>9.2f}% {rec:>9.2f}% {f1:>9.2f}% {auc:>10.4f}")

print("="*90)
best = max(results, key=lambda x: x[1])
print(f"\n🏆 WINNER: {best[0]}")
print(f"   Accuracy: {best[1]:.2f}%  |  F1: {best[4]:.2f}%  |  ROC-AUC: {best[5]:.4f}")
print("="*90)
