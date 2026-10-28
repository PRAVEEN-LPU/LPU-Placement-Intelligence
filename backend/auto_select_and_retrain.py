"""
=============================================================================
  AUTO MODEL SELECTION & RETRAIN SCRIPT
  LPU Placement Intelligence — by PRAVEEN
=============================================================================
  Steps:
    1. Compare ALL 8 classifiers on Accuracy, Precision, Recall, F1, AUC
    2. Compute combined score → pick WINNER
    3. Retrain full pipeline on WINNER model
    4. Save new placement_model.joblib
    5. Print final report
=============================================================================
"""

import os, sys
import numpy as np
import pandas as pd
import joblib
from datetime import datetime

from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier,
    AdaBoostClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
)
from sklearn.model_selection import train_test_split, cross_val_score

sys.path.insert(0, os.path.dirname(__file__))
from model import (
    generate_synthetic_student_data,
    FEATURE_NAMES,
    FEATURE_METADATA,
    TARGET_THRESHOLDS,
)

MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "placement_model.joblib")
DATASET_PATH   = os.path.join(os.path.dirname(__file__), "..", "dataset", "students.csv")

# ─────────────────────────────────────────────────────────────────────────────
# 1. LOAD DATA
# ─────────────────────────────────────────────────────────────────────────────
def load_data():
    if os.path.exists(DATASET_PATH):
        try:
            df = pd.read_csv(DATASET_PATH)
            required = FEATURE_NAMES + ["placement_ready"]
            if all(c in df.columns for c in required):
                df = df[required].dropna()
                if len(df) >= 50:
                    print(f"[DATA] Loaded students.csv  ({len(df)} records)")
                    return df
        except Exception:
            pass
    df = generate_synthetic_student_data(n_samples=2500, random_state=42)
    print(f"[DATA] Using synthetic data  ({len(df)} records)")
    return df

# ─────────────────────────────────────────────────────────────────────────────
# 2. ALL CANDIDATES
# ─────────────────────────────────────────────────────────────────────────────
def get_candidates():
    return {
        "Random Forest (250 trees)":    RandomForestClassifier(
                                            n_estimators=250, max_depth=12,
                                            min_samples_split=4, min_samples_leaf=2,
                                            class_weight="balanced", random_state=42),
        "Gradient Boosting":            GradientBoostingClassifier(
                                            n_estimators=200, learning_rate=0.1,
                                            max_depth=5, random_state=42),
        "AdaBoost (100 est.)":          AdaBoostClassifier(
                                            n_estimators=100, random_state=42),
        "Logistic Regression":          LogisticRegression(
                                            max_iter=2000, random_state=42,
                                            class_weight="balanced"),
        "Decision Tree (depth=8)":      DecisionTreeClassifier(
                                            max_depth=8, random_state=42,
                                            class_weight="balanced"),
        "K-Nearest Neighbors (k=5)":    KNeighborsClassifier(n_neighbors=5),
        "Support Vector Machine (RBF)": CalibratedClassifierCV(
                                            SVC(kernel="rbf", random_state=42)),
        "Naive Bayes":                  GaussianNB(),
    }

# ─────────────────────────────────────────────────────────────────────────────
# 3. EVALUATE ALL MODELS
# ─────────────────────────────────────────────────────────────────────────────
def evaluate_all(X_train, X_test, y_train, y_test):
    candidates = get_candidates()
    results = []

    print("\n" + "="*100)
    print("  FULL MODEL BENCHMARK — LPU PLACEMENT INTELLIGENCE  |  by PRAVEEN")
    print("="*100)
    print(f"{'Model':<35} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1-Score':>10} {'ROC-AUC':>10} {'Score':>8}")
    print("-"*100)

    for name, clf in candidates.items():
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)
        y_prob = clf.predict_proba(X_test)[:, 1]

        acc   = accuracy_score(y_test, y_pred)
        prec  = precision_score(y_test, y_pred, zero_division=0)
        rec   = recall_score(y_test, y_pred, zero_division=0)
        f1    = f1_score(y_test, y_pred, zero_division=0)
        auc   = roc_auc_score(y_test, y_prob)

        # Combined score = average of all 5 metrics (equal weight)
        combined = (acc + prec + rec + f1 + auc) / 5

        results.append({
            "name":     name,
            "clf":      clf,
            "accuracy": acc,
            "precision":prec,
            "recall":   rec,
            "f1":       f1,
            "auc":      auc,
            "combined": combined,
        })

        star = " <-- BEST" if False else ""
        print(f"{name:<35} {acc*100:>9.2f}% {prec*100:>9.2f}% {rec*100:>9.2f}% {f1*100:>9.2f}% {auc:>10.4f} {combined*100:>7.2f}")

    print("="*100)
    return results

# ─────────────────────────────────────────────────────────────────────────────
# 4. PICK WINNER
# ─────────────────────────────────────────────────────────────────────────────
def pick_winner(results):
    winner = max(results, key=lambda r: r["combined"])
    return winner

# ─────────────────────────────────────────────────────────────────────────────
# 5. RETRAIN WINNER ON FULL DATA & SAVE
# ─────────────────────────────────────────────────────────────────────────────
def retrain_and_save(winner, df):
    X = df[FEATURE_NAMES]
    y = df["placement_ready"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    clf = winner["clf"]
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    y_prob = clf.predict_proba(X_test)[:, 1]
    cm     = confusion_matrix(y_test, y_pred).tolist()

    metrics = {
        "accuracy":         round(float(accuracy_score(y_test, y_pred)), 4),
        "precision":        round(float(precision_score(y_test, y_pred, zero_division=0)), 4),
        "recall":           round(float(recall_score(y_test, y_pred, zero_division=0)), 4),
        "f1_score":         round(float(f1_score(y_test, y_pred, zero_division=0)), 4),
        "roc_auc":          round(float(roc_auc_score(y_test, y_prob)), 4),
        "confusion_matrix": cm,
        "test_rows":        int(len(y_test)),
        "train_rows":       int(len(y_train)),
        "model_name":       winner["name"],
        "data_note":        f"Model: {winner['name']}. Trained on LPU placement dataset.",
    }

    # Feature importance (if available, else use coefficients/uniform)
    importance_map = {}
    if hasattr(clf, "feature_importances_"):
        total = sum(clf.feature_importances_)
        for f, imp in zip(FEATURE_NAMES, clf.feature_importances_):
            importance_map[f] = round(float(imp / total) * 100, 2)
    elif hasattr(clf, "coef_"):
        coefs = abs(clf.coef_[0])
        total = coefs.sum()
        for f, c in zip(FEATURE_NAMES, coefs):
            importance_map[f] = round(float(c / total) * 100, 2)
    else:
        # For models without native importance (KNN, NB, SVM) → uniform
        importance_map = {f: round(100/len(FEATURE_NAMES), 2) for f in FEATURE_NAMES}

    sorted_importance = dict(sorted(importance_map.items(), key=lambda x: x[1], reverse=True))

    payload = {
        "model":            clf,
        "feature_names":    FEATURE_NAMES,
        "feature_metadata": FEATURE_METADATA,
        "target_thresholds":TARGET_THRESHOLDS,
        "metrics":          metrics,
        "feature_importance": sorted_importance,
        "trained_at":       datetime.now().isoformat(),
        "model_version":    f"2.0.0-{winner['name'].replace(' ', '-').lower()}",
        "model_name":       winner["name"],
    }

    joblib.dump(payload, MODEL_SAVE_PATH)
    print(f"\n[SAVED] Model artifact saved: {os.path.abspath(MODEL_SAVE_PATH)}")
    return payload, metrics, sorted_importance

# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("\n" + "#"*100)
    print("#" + " "*35 + "LPU PLACEMENT INTELLIGENCE" + " "*35 + "#")
    print("#" + " "*28 + "AUTO MODEL SELECTION & RETRAIN" + " "*28 + "#")
    print("#" + " "*40 + "by PRAVEEN" + " "*46 + "#")
    print("#"*100)

    # Load data
    df = load_data()
    X  = df[FEATURE_NAMES]
    y  = df["placement_ready"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"[SPLIT] Train: {len(X_train)} | Test: {len(X_test)} | Class balance: {int(y.sum())} ready / {int((y==0).sum())} not ready")

    # Step 1: Evaluate all
    results = evaluate_all(X_train, X_test, y_train, y_test)

    # Step 2: Pick winner
    winner = pick_winner(results)

    print(f"\n{'='*100}")
    print(f"  WINNER (Highest Combined Score across ALL metrics):")
    print(f"{'='*100}")
    print(f"  Model      : {winner['name']}")
    print(f"  Accuracy   : {winner['accuracy']*100:.2f}%")
    print(f"  Precision  : {winner['precision']*100:.2f}%")
    print(f"  Recall     : {winner['recall']*100:.2f}%")
    print(f"  F1-Score   : {winner['f1']*100:.2f}%")
    print(f"  ROC-AUC    : {winner['auc']:.4f}")
    print(f"  Avg Score  : {winner['combined']*100:.2f}%")
    print(f"{'='*100}")

    # Step 3: Retrain & save
    print(f"\n[RETRAIN] Retraining full pipeline with: {winner['name']} ...")
    payload, metrics, importance = retrain_and_save(winner, df)

    # Final report
    print(f"\n{'='*100}")
    print(f"  FINAL MODEL REPORT — {winner['name']}")
    print(f"{'='*100}")
    print(f"  Accuracy   : {metrics['accuracy']*100:.2f}%")
    print(f"  Precision  : {metrics['precision']*100:.2f}%")
    print(f"  Recall     : {metrics['recall']*100:.2f}%")
    print(f"  F1-Score   : {metrics['f1_score']*100:.2f}%")
    print(f"  ROC-AUC    : {metrics['roc_auc']:.4f}")
    print(f"  Train rows : {metrics['train_rows']}")
    print(f"  Test rows  : {metrics['test_rows']}")
    print(f"  Confusion  : {metrics['confusion_matrix']}")
    print(f"\n  Feature Importance / Weight:")
    for rank, (feat, imp) in enumerate(list(importance.items()), 1):
        bar = "#" * int(imp / 2)
        print(f"  {rank:>2}. {feat:<25} {bar:<25} {imp:5.2f}%")
    print(f"\n  Version    : {payload['model_version']}")
    print(f"  Trained at : {payload['trained_at']}")
    print(f"{'='*100}")
    print(f"  Done! Run 'python app.py' to start the API with the new model.")
    print(f"{'='*100}\n")


if __name__ == "__main__":
    main()
