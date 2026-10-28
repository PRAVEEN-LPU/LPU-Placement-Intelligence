<div align="center">

# 🎓 LPU Placement Intelligence
### Student Readiness Prediction & Skill Gap Analysis Platform

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-REST_API-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev)
[![ML](https://img.shields.io/badge/ML-Random_Forest-orange?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **Built with ❤️ by [PRAVEEN](https://github.com/PRAVEEN-LPU)**

<br/>

An end-to-end **Machine Learning web application** designed to evaluate a student's preparedness for campus placement drives, identify specific skill gaps against institutional benchmarks, and generate transparent, actionable improvement roadmaps.

</div>

---

## 📸 Application Screenshots

<table>
<tr>
<td align="center" width="50%">
<img src="screenshots/fig1_dashboard_top_performer.png" alt="Main Dashboard" width="100%"/>
<br/><b>🏠 Main Dashboard — Student Competency Matrix</b>
</td>
<td align="center" width="50%">
<img src="screenshots/fig2_skill_gap_matrix.png" alt="Skill Gap Matrix" width="100%"/>
<br/><b>🔍 Skill Gap Matrix — Gap Severity Analysis</b>
</td>
</tr>
<tr>
<td align="center" width="50%">
<img src="screenshots/fig3_action_roadmap.png" alt="Action Roadmap" width="100%"/>
<br/><b>🗺️ Personalized Action Roadmap</b>
</td>
<td align="center" width="50%">
<img src="screenshots/fig4_influential_factors.png" alt="Influential Factors" width="100%"/>
<br/><b>📊 Influential ML Factors Chart</b>
</td>
</tr>
<tr>
<td align="center" colspan="2">
<img src="screenshots/fig5_needs_focus_profile.png" alt="Needs Focus Profile" width="50%"/>
<br/><b>🔴 Needs Focus — Profile Analysis View</b>
</td>
</tr>
</table>

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| 🎛️ **Competency Matrix Dashboard** | Interactive sliders for 9 student parameters with live sync |
| 🤖 **ML Inference Engine** | Random Forest (250 trees) with 91% accuracy & 0.97 AUC |
| 🔍 **Skill Gap Matrix** | Compares student params against placement cutoffs |
| 🗺️ **Action Roadmap** | Prioritized 30–60 day improvement plans |
| 📄 **Report Export** | Print-optimized diagnostic scorecard |
| ⚡ **Quick Presets** | One-click: Top Performer / Average / Needs Focus / Backlogs |

---

## 📊 Datasets Used

> **7 datasets · 4,048 total student records**

| # | Dataset File | Records | Source | Key Features |
|---|---|---|---|---|
| 1 | `students.csv` | 253 | 🏫 **Curated / Synthetic** — LPU competency schema | CGPA, Coding, Technical, Aptitude, Projects, Backlogs (9-feature model) |
| 2 | `college_placement_engineering.csv` | 2,966 | 🏷️ **Kaggle** — [Engineering College Placement Dataset](https://www.kaggle.com/datasets/tejashvi14/engineering-placements-prediction) by Urvashi Ramdasani | Age, Gender, Stream (CS/IT/ECE/Mech), Internships, CGPA, Backlogs |
| 3 | `campus_recruitment_kaggle.csv` | 215 | 🏷️ **Kaggle** — [Campus Recruitment](https://www.kaggle.com/datasets/benisonsunil/campus-recruitment) by Benison Sunil | 10th%, 12th%, Degree%, WorkEx, Aptitude%, MBA%, Salary |
| 4 | `job_placement_features.csv` | 215 | 🏷️ **Kaggle** — [Job Placement ML Benchmark](https://www.kaggle.com/datasets/kaushikiitbhu/placement-dataset) by Kaushiki Gupta | Gender, SSC%, HSC%, Degree%, Work Experience, MBA%, Status |
| 5 | `engineering_skills_placement.csv` | 99 | 🏷️ **Kaggle** — [Engineering Skills Placement](https://www.kaggle.com/datasets/kunalrathod/engineering-placement-analysis) by Kunal Rathod | Sem 1–5 Scores, Programming Language, Certifications, Field |
| 6 | `placement_package_salary.csv` | 200 | 📦 **CampusX** — ML Regression Repository | CGPA vs Salary Package (LPA) — Regression benchmark |
| 7 | `placement_iq_academic.csv` | 100 | 📦 **CampusX** — Classification Benchmark | CGPA + IQ Score → Placement Classification |

### 🎯 Primary Training Dataset
The **live ML API uses `students.csv`** — curated with 9 granular, actionable parameters that students can actually improve:
`CGPA` · `Coding Score` · `Technical Score` · `Aptitude` · `Communication` · `Projects` · `Internships` · `Certifications` · `Backlogs`

---

## 🤖 Model Comparison — All Algorithms Tested

> Trained on **2,500 synthetic profiles** (80% train / 20% test, stratified split, seed=42)

| Rank | Algorithm | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|---|
| 1 | Logistic Regression | **93.40%** | 91.34% | 96.56% | 93.88% | **0.9844** |
| 2 | AdaBoost (100 estimators) | 92.00% | 90.22% | 95.04% | 92.57% | 0.9819 |
| 🏆 3 | **Random Forest (250 trees)** | **91.00%** | **90.64%** | **92.37%** | **91.49%** | **0.9724** |
| 4 | Gradient Boosting | 90.60% | 89.96% | 92.37% | 91.15% | 0.9704 |
| 5 | Naive Bayes | 89.60% | 88.60% | 91.98% | 90.26% | 0.9643 |
| 6 | Decision Tree (depth=8) | 84.00% | 82.50% | 88.17% | 85.24% | 0.8712 |
| 7 | Support Vector Machine (RBF) | 83.00% | 81.95% | 86.64% | 84.23% | 0.9091 |
| 8 | K-Nearest Neighbors (k=5) | 76.80% | 76.84% | 79.77% | 78.28% | 0.8463 |

### 🏆 Why Random Forest was chosen (over Logistic Regression):

| Criterion | Logistic Regression | **Random Forest** |
|---|---|---|
| Accuracy | 93.40% | 91.00% |
| Handles non-linear features | ❌ No | ✅ Yes |
| Feature Importance (native) | ❌ No | ✅ Yes (Gini) |
| Requires feature scaling | ✅ Yes (preprocessing needed) | ❌ No |
| Overfitting resistance | Medium | **High (ensemble)** |
| Interpretability for education | Low | **High (tree voting)** |

> While Logistic Regression has slightly higher accuracy, **Random Forest** was selected because it natively provides **feature importance rankings** (showing students which skill matters most), handles non-linear skill interactions, and is more robust without feature normalization.

### 📊 Top Feature Importance (Gini Impurity — Random Forest)

```
CGPA (Academic)          ████████████████████████░  25.18%  ← Primary eligibility gate
Technical Score          ██████████████████░░░░░░░  18.82%  ← Tech interview round
Coding / DSA             ████████████████░░░░░░░░░  16.76%  ← First-round eliminator
Active Backlogs          ████████████░░░░░░░░░░░░░  12.57%  ← Binary disqualifier
Aptitude & Reasoning     ██████░░░░░░░░░░░░░░░░░░░   6.67%  ← Online assessment
Industry Internships     ██████░░░░░░░░░░░░░░░░░░░   6.08%  ← Differentiator
Communication & HR       █████░░░░░░░░░░░░░░░░░░░░   5.78%  ← GD + HR round
Practical Projects       █████░░░░░░░░░░░░░░░░░░░░   4.92%  ← Resume depth
Certifications           ███░░░░░░░░░░░░░░░░░░░░░░   3.22%  ← Supporting factor
```

---

## 📁 Repository Structure

```text
LPU-Placement-Intelligence/
├── backend/                           # 🐍 Python Flask & Machine Learning
│   ├── app.py                         # REST API server (Port 5000)
│   ├── model.py                       # ML models, synthetic generator, skill gaps
│   ├── train_model.py                 # Standalone model training script
│   ├── train_kaggle.py                # Kaggle dataset training + EDA script
│   ├── compare_models.py              # Multi-model accuracy comparison script
│   ├── placement_model.joblib         # Pre-trained model binary artifact
│   ├── test_api.py                    # Automated API test suite
│   └── requirements.txt              # Python package dependencies
│
├── frontend/                          # ⚛️ React + Vite Dashboard
│   ├── src/
│   │   ├── App.jsx                    # Interactive dashboard component
│   │   ├── style.css                  # Modern UI & responsive styling
│   │   └── main.jsx                   # React root mount
│   ├── index.html                     # Web entry point
│   ├── package.json                   # React, Vite, Recharts, Lucide deps
│   └── vite.config.js                 # Vite server & API proxy config
│
├── dataset/                           # 📊 7 Training datasets (4,048 records)
│   ├── students.csv                   # Primary LPU 9-feature model dataset
│   ├── campus_recruitment_kaggle.csv  # Kaggle campus recruitment (215 records)
│   ├── college_placement_engineering.csv # Kaggle engineering dataset (2,966 records)
│   ├── job_placement_features.csv     # Kaggle job placement benchmark (215 records)
│   ├── engineering_skills_placement.csv # Semester + skills dataset (99 records)
│   ├── placement_package_salary.csv   # CampusX salary regression (200 records)
│   └── placement_iq_academic.csv      # CampusX IQ classification (100 records)
│
├── screenshots/                       # 🖼️ Application screenshots
├── brain/                             # 📋 Project blueprints & architecture docs
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

| Requirement | Version | Download |
|---|---|---|
| Python | 3.10+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| npm | 9+ | Comes with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Complete Setup & Run Guide

### Step 1 — Clone the Repository
```bash
git clone https://github.com/PRAVEEN-LPU/LPU-Placement-Intelligence.git
cd LPU-Placement-Intelligence
```

---

### Step 2 — Backend Setup (Python + Flask)

> Open **Terminal 1** and run:

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate — Windows PowerShell:
.\.venv\Scripts\Activate.ps1

# Activate — Windows CMD:
.\.venv\Scripts\activate.bat

# Activate — macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask API server
python app.py
```

✅ API live at: `http://127.0.0.1:5000`  
✅ Health check: `http://127.0.0.1:5000/api/health`

---

### Step 3 — Frontend Setup (React + Vite)

> Open **Terminal 2** and run:

```bash
# Navigate to frontend (from project root)
cd frontend

# Install Node.js dependencies
npm install

# Start dev server
npm run dev
```

✅ App live at: `http://localhost:5173`

---

### Step 4 — Open the App

```
http://localhost:5173
```

---

## 🧪 Run Automated API Tests

```bash
cd backend
.\.venv\Scripts\python.exe test_api.py
```

---

## 🔁 Re-train the Model

```bash
cd backend

# Train on synthetic data (default)
python train_model.py

# Train on Kaggle campus recruitment dataset
python train_kaggle.py

# Compare all 8 models (Accuracy Benchmark)
python compare_models.py
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/predict` | Get ML placement prediction |
| `POST` | `/api/skill-gap` | Get skill gap analysis |
| `POST` | `/api/roadmap` | Get personalized action roadmap |

### Example API Request
```bash
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "cgpa": 8.5,
    "coding_score": 80,
    "technical_score": 75,
    "aptitude_score": 72,
    "communication_score": 85,
    "projects": 4,
    "internships": 1,
    "certifications": 3,
    "backlogs": 0
  }'
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Recharts, Lucide Icons |
| **Backend** | Python 3.10, Flask, Flask-CORS |
| **ML Library** | Scikit-learn, NumPy, Pandas |
| **Model** | Random Forest Classifier (250 estimators) |
| **Styling** | Custom CSS with dark theme |
| **API** | RESTful JSON API |

---

## ⚠️ Educational Disclaimer

This platform utilizes a reproducible **synthetic demonstration dataset** modeling student performance distributions for training purposes. Predictions represent diagnostic readiness indicators and **do not constitute** a legal, formal, or institutional guarantee of campus recruitment outcomes.

---

## 📜 License

This project is licensed under the **MIT License**.

> ⚠️ **Important:** Any use, fork, or distribution of this project **must retain the original author credit**:
>
> **Created by [PRAVEEN](https://github.com/PRAVEEN-LPU)**

---

<div align="center">

### Made with 🔥 by [PRAVEEN](https://github.com/PRAVEEN-LPU)

[![GitHub](https://img.shields.io/badge/GitHub-PRAVEEN--LPU-181717?style=for-the-badge&logo=github)](https://github.com/PRAVEEN-LPU)

*If you use or fork this project, please keep the author's name intact. Attribution matters!*

</div>
