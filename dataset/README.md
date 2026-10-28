# LPU Placement Intelligence Platform
## Complete Dataset Repository & Viva Reference Guide

---

## Datasets in the `dataset/` Folder

The project currently contains **7 distinct datasets** with a combined total of **4,048 student records**, covering multi-dimensional placement factors: competency skills, real engineering college placements, MBA/recruitment benchmarks, semester-wise programming records, cognitive metrics, and salary package distributions.

| # | Dataset File | Rows | Features | Focus / Schema |
|---|---|---|---|---|
| **1** | [`students.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/students.csv) | 253 | 10 | Primary LPU 9-feature Competency Model (CGPA, Coding, Technical, Aptitude, Projects, Backlogs) |
| **2** | [`college_placement_engineering.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/college_placement_engineering.csv) | 2,966 | 8 | Real Engineering Students Placement (Age, Gender, Stream, Internships, CGPA, Backlogs, Placed) |
| **3** | [`campus_recruitment_kaggle.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/campus_recruitment_kaggle.csv) | 215 | 15 | Kaggle Campus Recruitment (10th%, 12th%, Degree%, WorkEx, Aptitude%, MBA%, Salary) |
| **4** | [`job_placement_features.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/job_placement_features.csv) | 215 | 13 | Multi-factor Cleaned Job Placement Data (Standardized percentages, streams, status) |
| **5** | [`engineering_skills_placement.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/engineering_skills_placement.csv) | 99 | 13 | Engineering Semesters + Programming Language + Certifications + Field Placement |
| **6** | [`placement_package_salary.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/placement_package_salary.csv) | 200 | 2 | Student CGPA vs Placement Salary Package in LPA (Linear / Polynomial Regression) |
| **7** | [`placement_iq_academic.csv`](file:///c:/Users/Dell/Desktop/supervised/dataset/placement_iq_academic.csv) | 100 | 3 | Cognitive Ability (IQ) + Academic CGPA Placement Classification |

---

## Detailed Dataset Profiles

### Dataset 1 — Primary Curated Dataset: `students.csv`
* **Records**: 253 students
* **Target**: `placement_ready` (1 = Ready, 0 = Not Ready)
* **Key Features**: `cgpa`, `technical_score`, `aptitude_score`, `communication_score`, `coding_score`, `projects`, `internships`, `certifications`, `backlogs`
* **Purpose**: Primary training dataset matching our institutional 9-feature ML schema.
* **Viva Explanation**: *"Humne institutional campus placement criteria ke base par ye dataset curate kiya hai jisme academic, coding aur practical experience ke modern features hain."*

---

### Dataset 2 — Large Engineering College Placement: `college_placement_engineering.csv`
* **Records**: 2,966 engineering students
* **Source**: Kaggle College Placement Dataset (Urvashi Ramdasani / Nirantk)
* **Target**: `PlacedOrNot` (1 = Placed, 0 = Not Placed)
* **Columns**: `Age`, `Gender`, `Stream` (CS, IT, ECE, Mech, Civil, Electrical), `Internships`, `CGPA`, `Hostel`, `HistoryOfBacklogs`, `PlacedOrNot`
* **Purpose**: Large-scale institutional engineering benchmark proving the correlation of backlogs, internships, and branch streams on actual placements.
* **Viva Explanation**: *"Ye 2,966 engineering students ka comprehensive real dataset hai. Isme actual branch streams (CS, IT, Mech), internships count aur backlogs ka placement par impact validate kiya gaya hai."*

---

### Dataset 3 — Kaggle Campus Recruitment: `campus_recruitment_kaggle.csv`
* **Records**: 215 students
* **Source**: Kaggle Campus Recruitment (Benison Sunil)
* **Target**: `status` (Placed / Not Placed) + `salary`
* **Columns**: `ssc_p`, `ssc_b`, `hsc_p`, `hsc_b`, `hsc_s`, `degree_p`, `degree_t`, `workex`, `etest_p`, `specialisation`, `mba_p`, `status`, `salary`
* **Purpose**: Academic progression benchmark across 10th, 12th, graduation, and post-graduation with company salary packages.
* **Viva Explanation**: *"Ye Kaggle ka standard benchmark dataset hai jisme academic milestones (10th, 12th, degree) aur past work experience ke effect ko measure kiya gaya hai."*

---

### Dataset 4 — Multi-Factor Job Placement: `job_placement_features.csv`
* **Records**: 215 students
* **Source**: Kaushiki Gupta / Job Placement ML Benchmark
* **Target**: `status` (Placed / Not Placed)
* **Columns**: `gender`, `ssc_percentage`, `ssc_board`, `hsc_percentage`, `hsc_board`, `hsc_subject`, `degree_percentage`, `undergrad_degree`, `work_experience`, `emp_test_percentage`, `specialisation`, `mba_percent`, `status`
* **Purpose**: Pre-cleaned, normalized categorical format benchmark for cross-model validation.

---

### Dataset 5 — Engineering Semesters & Skills: `engineering_skills_placement.csv`
* **Records**: 99 engineering students
* **Source**: Kunal Rathod / Engineering Placement Analysis
* **Target**: `placed` (yes / no)
* **Columns**: `name`, `thenthScore`, `twelthScore`, `firstSemScore`, `secondSemScore`, `thirdSemScore`, `fourthSemScore`, `fifthSemScore`, `attendance`, `numberOfCertifications`, `favouriteLanguage` (Java, Python, C++, etc.), `workingField` (Web Dev, ML, Software, etc.), `placed`
* **Purpose**: Real engineering college semester-wise trajectory, coding language preference, and domain specializations.
* **Viva Explanation**: *"Is dataset mein semester 1 se semester 5 tak ke individual semester scores, programming language preference (Python/Java/C++) aur certifications ka placement par impact diya gaya hai."*

---

### Dataset 6 — Salary Package Regression: `placement_package_salary.csv`
* **Records**: 200 students
* **Source**: CampusX ML Repositories
* **Target**: `package` (LPA salary offer)
* **Columns**: `cgpa`, `package`
* **Purpose**: Continuous salary prediction based on academic GPA, demonstrating regression modeling alongside classification.
* **Viva Explanation**: *"Ye dataset continuous salary package (LPA) ko predict karne ke liye regression benchmark provide karta hai."*

---

### Dataset 7 — Academic & Cognitive IQ: `placement_iq_academic.csv`
* **Records**: 100 students
* **Source**: CampusX Classification Benchmark
* **Target**: `placement` (1 = Placed, 0 = Not Placed)
* **Columns**: `cgpa`, `iq`, `placement`
* **Purpose**: Demonstrates decision boundary separation between academic GPA and cognitive intelligence quotient (IQ).

---

## Summary of Total Data Assets

| Metric | Value |
|---|---|
| **Total Datasets** | **7 CSV files** |
| **Total Records** | **4,048 student rows** |
| **Classification Datasets** | 6 datasets |
| **Regression Datasets** | 1 dataset (`placement_package_salary.csv`) |
| **Large-scale Engineering Dataset** | `college_placement_engineering.csv` (2,966 rows) |

---

## Talking Points for Viva / Teacher Presentation

1. **Why do we have 7 datasets in the folder?**
   > *"Sir/Ma'am, humne single dataset par rely nahi kiya. Hamara core model `students.csv` ke 9 granular skill parameters par train hota hai, lekin model ki validity aur generalizability prove karne ke liye humne 6 external datasets add kiye hain: 2,966 engineering student profiles wala Kaggle dataset, semester-wise coding skills dataset, academic progression benchmarks, aur salary package regression dataset."*

2. **Which dataset is used to train the live ML API?**
   > *"Live platform `students.csv` use karta hai kyunki usme technical score, coding score, projects, internships aur active backlogs jaise actionable parameters hain jinhe student improve kar sakta hai."*
