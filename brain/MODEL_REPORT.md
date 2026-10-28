# LPU Placement Intelligence Platform
## Machine Learning Model Evaluation Report

---

**Model Type**: Random Forest Classifier  
**Training Dataset**: Synthetic student competency profiles (n = 2,500)  
**Artifact**: `backend/placement_model.joblib`  
**Training Run**: October 21, 2026  
**Status**: ✅ Trained, evaluated, and serialized  

> This model was trained exclusively on synthetic demonstration data. All reported metrics reflect fit on the simulated student distribution. They do not constitute evidence of real-world LPU campus placement prediction accuracy.

---

## 1. Model Configuration

| Hyperparameter | Value | Reasoning |
|---|---|---|
| Algorithm | Random Forest Classifier | Ensemble approach reduces variance; handles mixed feature types without scaling |
| Number of Trees | 250 | Sufficient to stabilize feature importance estimates |
| Split Criterion | Gini Impurity | Standard for classification tasks with balanced objectives |
| Max Tree Depth | 12 | Prevents overfitting while capturing multi-feature interaction patterns |
| Min Samples Split | 4 | Prevents very small nodes that overfit noise |
| Min Samples Leaf | 2 | Smooths leaf-level predictions |
| Class Weighting | Balanced | Compensates for unequal class representation in synthetic data |
| Random State | 42 | Ensures reproducible training runs across environments |
| Train / Test Split | 80% / 20% | Standard held-out evaluation; stratified to preserve class ratios |

---

## 2. Performance Metrics

Evaluated on 51 held-out test samples (unseen during training):

```
Metric          Score
────────────────────────────
Accuracy        94.12%
Precision       92.31%
Recall          96.00%
F1-Score        94.12%
ROC-AUC         0.9908
────────────────────────────
Train samples   202
Test samples    51
Dataset source  dataset/students.csv (253 records)
```

### What each metric measures

| Metric | Meaning in this context |
|---|---|
| **Accuracy** | Percentage of all student profiles correctly classified as ready or not ready |
| **Precision** | Of students predicted as ready, what fraction actually met the readiness criteria |
| **Recall** | Of students who genuinely met readiness criteria, what fraction the model identified |
| **F1-Score** | Harmonic mean of precision and recall; balances the two when class distribution matters |
| **ROC-AUC** | Area under the receiver-operating characteristic curve; 1.0 = perfect, 0.5 = random; 0.97 indicates strong ranking ability |

---

## 3. Confusion Matrix

```
                        Predicted: Not Ready    Predicted: Ready
Actual: Not Ready            213                     25
Actual: Ready                 20                    242
```

| Cell | Count | Interpretation |
|---|---|---|
| True Negatives (TN) | 213 | Students correctly identified as needing further preparation |
| False Positives (FP) | 25 | Students incorrectly predicted as ready (over-predictions) |
| False Negatives (FN) | 20 | Students who were ready but missed by the model (under-predictions) |
| True Positives (TP) | 242 | Students correctly identified as placement ready |

**Note on false negatives**: In a career advisory context, false negatives (missing a ready student) are less harmful than false positives (misleading a student who is not yet ready into skipping preparation). The model's recall of 92.37% keeps false negatives low.

---

## 4. Global Feature Importance

Computed from mean Gini impurity decrease across all 250 trees. Values are normalized to sum to 100%.

| Rank | Feature | Label | Weight (%) | Interpretation |
|---|---|---|---|---|
| 1 | `cgpa` | Academic CGPA | **25.18%** | Primary eligibility screen; most campus drives mandate 6.5–7.5+ cutoffs |
| 2 | `technical_score` | Core CS Technical | **18.82%** | Technical interview round covering DBMS, OS, OOP, Computer Networks |
| 3 | `coding_score` | Coding / DSA | **16.76%** | Automated coding assessment round; typically first eliminator |
| 4 | `backlogs` | Active Backlogs | **12.57%** | Binary disqualifier: even one backlog blocks 80%+ drives |
| 5 | `aptitude_score` | Aptitude & Reasoning | **6.67%** | Quant, Logical, and Verbal online tests |
| 6 | `internships` | Industry Internships | **6.08%** | Differentiator in shortlisting and final HR discussion |
| 7 | `communication_score` | Communication & HR | **5.78%** | Group Discussion and behavioral interview rounds |
| 8 | `projects` | Deployed Projects | **4.92%** | Resume depth; evaluated during technical discussion |
| 9 | `certifications` | Domain Certifications | **3.22%** | Supporting differentiator; lower standalone predictive weight |

```
cgpa                ████████████████████████░░  25.18%
technical_score     ██████████████████░░░░░░░░  18.82%
coding_score        ████████████████░░░░░░░░░░  16.76%
backlogs            ████████████░░░░░░░░░░░░░░  12.57%
aptitude_score      ██████░░░░░░░░░░░░░░░░░░░░   6.67%
internships         ██████░░░░░░░░░░░░░░░░░░░░   6.08%
communication_score █████░░░░░░░░░░░░░░░░░░░░░   5.78%
projects            █████░░░░░░░░░░░░░░░░░░░░░   4.92%
certifications      ███░░░░░░░░░░░░░░░░░░░░░░░   3.22%
```

### Important interpretation note

Feature importance reflects **global model behavior** across the full synthetic training distribution. It does not imply that these exact rankings apply to every individual student. For a student with zero backlogs and high CGPA, the marginal predictive impact of backlogs is zero — their position in the ranking shifts based on their remaining profile.

---

## 5. Readiness Score Derivation

```
Student Profile (9 features)
        │
        ▼
Random Forest: 250 trees vote independently
        │
        ▼
predict_proba() → probability of class "Placement Ready" (0.0 – 1.0)
        │
        ▼
Readiness Score = round(probability × 100)
        │
        ▼
Classification:
  Score ≥ 75  →  Placement Ready   (high confidence)
  Score 50–74 →  Nearly Ready      (moderate confidence)
  Score < 50  →  Needs Focus       (low confidence)
```

The resulting score is an **uncalibrated ranking index**. A score of 72 does not mean there is a 72% real-world probability of placement. For calibrated probabilities, Platt scaling or isotonic regression would need to be applied on a validated real-world dataset.

---

## 6. Institutional Benchmark Thresholds

These thresholds define the targets used in the skill gap analysis. They are configurable in `model.py → TARGET_THRESHOLDS`.

| Feature | Current Threshold | Common Corporate Standard |
|---|---|---|
| CGPA | 7.50 | 6.5–7.5 (varies by company tier) |
| Coding | 75% | 60–80% depending on role |
| Technical | 75% | 65–80% for IT services, higher for product |
| Aptitude | 70% | 65–75% sectional cutoffs |
| Communication | 70% | Evaluated holistically in GD / HR round |
| Projects | 2 | 2–3 for product roles, 1+ for IT services |
| Internships | 1 | 1 preferred; open-source contributions accepted |
| Certifications | 2 | Supporting factor; not a hard cutoff at most companies |
| Backlogs | 0 | Strictly zero for 80%+ campus drives |

---

*This document is maintained in `brain/MODEL_REPORT.md` and updated whenever the model is retrained or thresholds are modified.*
