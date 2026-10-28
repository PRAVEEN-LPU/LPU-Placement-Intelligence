"""
Model Training Script — LPU Placement Intelligence Platform

Priority order for training data:
  1. dataset/students.csv  (manually curated records, preferred)
  2. Synthetic generator   (fallback if CSV not found)

Run from the backend/ directory:
  .venv\Scripts\python.exe train_model.py
"""

import os
import sys
import pandas as pd
from model import (
    train_placement_model,
    generate_synthetic_student_data,
    FEATURE_NAMES,
)

DATASET_PATH = os.path.join(
    os.path.dirname(__file__), "..", "dataset", "students.csv"
)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "placement_model.joblib")


def load_dataset() -> tuple[pd.DataFrame, str]:
    """
    Attempts to load the manually curated CSV dataset.
    Falls back to synthetic generation if the file is not found or invalid.

    Returns
    -------
    (dataframe, source_label)
    """
    if os.path.exists(DATASET_PATH):
        try:
            df = pd.read_csv(DATASET_PATH)

            required_cols = FEATURE_NAMES + ["placement_ready"]
            missing = [c for c in required_cols if c not in df.columns]
            if missing:
                raise ValueError(
                    f"CSV is missing required columns: {missing}"
                )

            # Drop rows with any nulls in required columns
            before = len(df)
            df = df[required_cols].dropna()
            after = len(df)

            if after < 50:
                raise ValueError(
                    f"Dataset has only {after} valid rows after cleaning — too few to train."
                )

            dropped = before - after
            source = f"dataset/students.csv  ({after} records"
            if dropped:
                source += f", {dropped} rows dropped due to missing values"
            source += ")"
            return df, source

        except Exception as exc:
            print(f"\n[WARNING] Could not load dataset/students.csv: {exc}")
            print("[WARNING] Falling back to synthetic data generator.\n")

    # Fallback: synthetic generator
    df = generate_synthetic_student_data(n_samples=2500, random_state=42)
    return df, "Synthetic generator (dataset/students.csv not found or invalid)"


def main():
    print("=" * 70)
    print("  LPU Placement Intelligence Platform — Model Training Pipeline   ")
    print("=" * 70)

    # ── Step 1: Load data ──────────────────────────────────────────────────
    print("\nStep 1 — Loading training data ...")
    data_df, source_label = load_dataset()
    print(f"         Source  : {source_label}")
    print(f"         Shape   : {data_df.shape[0]} rows × {data_df.shape[1]} columns")
    print(f"         Features: {', '.join(FEATURE_NAMES)}")
    print(f"         Label   : placement_ready")
    print(
        f"         Class split: "
        f"{int(data_df['placement_ready'].sum())} ready "
        f"/ {int((data_df['placement_ready'] == 0).sum())} not ready"
    )

    # ── Step 2: Train ─────────────────────────────────────────────────────
    print("\nStep 2 — Splitting dataset (80% train / 20% test, stratified) ...")
    print("Step 3 — Training Random Forest Classifier (250 trees, max_depth=12) ...")

    payload = train_placement_model(data_df=data_df, save_path=MODEL_PATH)
    metrics = payload["metrics"]

    # ── Step 3: Report ────────────────────────────────────────────────────
    print("\n" + "-" * 70)
    print("                   MODEL PERFORMANCE EVALUATION                     ")
    print("-" * 70)
    print(f"  Accuracy   : {metrics['accuracy'] * 100:.2f}%")
    print(f"  Precision  : {metrics['precision'] * 100:.2f}%")
    print(f"  Recall     : {metrics['recall'] * 100:.2f}%")
    print(f"  F1-Score   : {metrics['f1_score'] * 100:.2f}%")
    print(f"  ROC-AUC    : {metrics['roc_auc']:.4f}")
    print(f"  Train rows : {metrics['train_rows']}")
    print(f"  Test rows  : {metrics['test_rows']}")
    print(f"  Confusion  : {metrics['confusion_matrix']}")
    print("-" * 70)

    print("\n  Top Feature Importance (Gini, normalized):")
    for rank, (feat, imp) in enumerate(
        list(payload["feature_importance"].items())[:9], start=1
    ):
        bar = "#" * int(imp / 2)
        print(f"  {rank:>2}. {feat:<22} {bar:<25} {imp:5.2f}%")

    print(f"\n  Artifact saved: {os.path.abspath(MODEL_PATH)}")
    print(f"\n  [NOTE] {metrics['data_note']}")
    print("=" * 70)
    print("  Training completed. Run 'python app.py' to start the API server.")
    print("=" * 70)


if __name__ == "__main__":
    main()
