"""
PDF Generator — 100% Simple English Version.
Complete Viva & Presentation Defense Guide: Question & Answer format.
"""

import sys
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        if self._pageNumber > 1:
            self.drawString(54, 800, "ML VIVA & PRESENTATION DEFENSE GUIDE (SIMPLE ENGLISH)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)

        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(541, 35, page_text)
        self.drawString(54, 35, "LPU Placement Intelligence Platform | Machine Learning Viva Reference")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 541, 48)

        self.restoreState()


def build_pdf():
    pdf_filename = "ML_Viva_Presentation_QA_Master_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=55,
        bottomMargin=55,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A"),
    )

    subtitle_style = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#475569"),
    )

    badge_style = ParagraphStyle(
        "BadgeText",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#0369A1"),
    )

    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=14,
        spaceAfter=6,
    )

    q_title_style = ParagraphStyle(
        "QuestionTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0F172A"),
    )

    spoken_style = ParagraphStyle(
        "SpokenAnswer",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#047857"), # Dark Green
    )

    explanation_style = ParagraphStyle(
        "PlainExplanation",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#1E293B"),
    )

    calc_style = ParagraphStyle(
        "Calculation",
        parent=styles["Normal"],
        fontName="Courier-Bold",
        fontSize=9,
        leading=12.5,
        textColor=colors.HexColor("#0F172A"),
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#1E293B"),
    )

    story = []

    # Header Tag
    badge_p = Paragraph("<b>VIVA & PRESENTATION CRACKER</b> &nbsp;|&nbsp; <b>MACHINE LEARNING METRICS GUIDE</b>", badge_style)
    badge_table = Table([[badge_p]], colWidths=[495])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#E0F2FE")),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('ROUNDEDCORNERS', [4, 4, 4, 4]),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Machine Learning Model Selection & Evaluation Metrics", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Complete Question & Answer Defense Guide:</b> Why Use Which Model, Factors to Consider, "
        "Confusion Matrix, Accuracy Paradox, Precision vs. Recall, F1-Score, and Live Calculations.",
        subtitle_style
    ))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#CBD5E1"), spaceAfter=10))

    def make_qa_box(q_num, q_text, what_to_say, explanation_text, calc_box=None):
        content = []
        content.append(Paragraph(f"<b>Q{q_num}: {q_text}</b>", q_title_style))
        content.append(Spacer(1, 4))

        content.append(Paragraph(f"<b>Exact Answer to Speak:</b> \"{what_to_say}\"", spoken_style))
        content.append(Spacer(1, 4))

        content.append(Paragraph(f"<b>Detailed Explanation:</b> {explanation_text}", explanation_style))

        if calc_box:
            content.append(Spacer(1, 4))
            c_p = Paragraph(f"<b>Formula / Numerical Example:</b><br/>{calc_box}", calc_style)
            c_t = Table([[c_p]], colWidths=[475])
            c_t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
                ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
                ('TOPPADDING', (0, 0), (-1, -1), 4),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ]))
            content.append(c_t)

        box_table = Table([[content]], colWidths=[495])
        box_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
            ('LINELEFT', (0, 0), (-1, -1), 3.5, colors.HexColor("#2563EB")),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ]))
        return KeepTogether([box_table, Spacer(1, 10)])

    # PART 1: PROBLEM CONTEXT & MODEL SELECTION
    story.append(Paragraph("PART 1: Problem Definition & Model Selection Strategy", section_heading))

    story.append(make_qa_box(
        1,
        "What does your system do and why is it a Supervised Classification problem?",
        "Our system predicts whether a student is 'Placement Ready' (1) or 'Not Ready' (0) using 9 competency features like CGPA, Coding Score, and Backlogs.",
        "It is <b>Supervised</b> because we train the model on historical records where both student features and the correct outcome (placed / not placed) are already known. It is <b>Classification</b> because the target output is a discrete category (Yes or No), rather than a continuous numeric value."
    ))

    story.append(make_qa_box(
        2,
        "What factors must you consider before choosing an ML model?",
        "We evaluate 4 primary factors: Target variable type, Dataset format, Linearity of decision boundaries, and Overfitting risk.",
        "1) <b>Target Variable:</b> Discrete categories require Classification (e.g. Placed vs Not Placed); continuous numbers require Regression (e.g. Salary in LPA).<br/>"
        "2) <b>Data Format:</b> For tabular data (rows and columns), Tree Ensembles (Random Forest / Gradient Boosting) are the gold standard. Deep learning is reserved for unstructured image or audio data.<br/>"
        "3) <b>Linearity:</b> Placement criteria are non-linear (e.g., high CGPA cannot compensate for active backlogs). Linear models fail on compound conditions.<br/>"
        "4) <b>Generalization:</b> Single Decision Trees memorize training noise. Ensembles combine 200 trees to eliminate overfitting."
    ))

    story.append(make_qa_box(
        3,
        "Why use which model? Compare Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting.",
        "Logistic Regression is a linear baseline; Decision Trees provide interpretable rules but overfit; Random Forest averages trees to reduce variance; Gradient Boosting iteratively corrects errors to achieve peak accuracy.",
        "• <b>Logistic Regression:</b> Fast and lightweight, but underfits complex tabular data (achieved 78.43% accuracy on our dataset).<br/>"
        "• <b>Decision Tree:</b> Creates intuitive IF-ELSE flowcharts, but suffers from high variance and severe overfitting (84.31% accuracy).<br/>"
        "• <b>Random Forest:</b> Builds 200 trees in parallel (Bagging) and takes a majority vote. Highly stable and resistant to noise (94.12% accuracy).<br/>"
        "• <b>Gradient Boosting (Our Winner):</b> Builds trees sequentially, with each tree correcting the residuals of earlier trees. Won our benchmark with 96.08% accuracy and 96.1% F1-score."
    ))

    story.append(make_qa_box(
        4,
        "What is the difference between Bagging (Random Forest) and Boosting (Gradient Boosting)?",
        "Bagging trains multiple independent trees in parallel and averages their predictions to reduce variance; Boosting trains trees sequentially, where each new tree focuses on correcting the errors of earlier trees.",
        "• <b>Bagging (Random Forest):</b> Think of 200 independent evaluators assessing a candidate simultaneously; majority consensus decides the result.<br/>"
        "• <b>Boosting (Gradient Boosting):</b> Think of a student taking an exam, having their mistakes analyzed, and passing those specific weak areas to the next reviewer for refinement."
    ))

    # PART 2: CONFUSION MATRIX & CORE METRICS
    story.append(Spacer(1, 10))
    story.append(Paragraph("PART 2: Confusion Matrix & Core Evaluation Metrics", section_heading))

    story.append(make_qa_box(
        5,
        "What is a Confusion Matrix? Explain TP, FP, TN, and FN using your project.",
        "A Confusion Matrix is a 2x2 contingency table that compares the model's predicted classes against actual ground-truth outcomes.",
        "• <b>True Positive (TP):</b> Model predicted 'Ready', and the student was truly hired. (Accurate Success)<br/>"
        "• <b>True Negative (TN):</b> Model predicted 'Not Ready', and the student truly had skill gaps. (Accurate Alert for remedial training)<br/>"
        "• <b>False Positive (FP - Type I Error):</b> Model predicted 'Ready', but the student failed the interviews. (Dangerous false confidence)<br/>"
        "• <b>False Negative (FN - Type II Error):</b> Model predicted 'Not Ready', but the student was actually talented. (Missed opportunity)"
    ))

    story.append(make_qa_box(
        6,
        "What is Accuracy, and what is the 'Accuracy Paradox'?",
        "Accuracy is the ratio of all correct predictions to total samples. The Accuracy Paradox occurs when an imbalanced dataset displays misleadingly high accuracy despite predicting the minority class poorly.",
        "<b>Formula:</b> (TP + TN) / (TP + TN + FP + FN)<br/>"
        "<b>The Paradox Trap:</b> Suppose 100 students apply for an elite drive where 95 fail and only 5 pass. A trivial model that blindly predicts 'Fail' for every single student gets <b>95% accuracy</b>! Yet it completely failed to identify a single selected candidate (Recall = 0%). That is why Accuracy alone cannot be trusted on real-world datasets.",
        "Accuracy = (TP + TN) / Total. Example: (45 + 45) / 100 = 90 / 100 = 90.0%"
    ))

    story.append(make_qa_box(
        7,
        "What is Precision, and when is it more critical than Recall?",
        "Precision measures positive prediction quality: out of all students predicted as 'Ready', how many were truly ready. It is critical when False Positives carry a high penalty.",
        "<b>Formula:</b> TP / (TP + FP)<br/>"
        "<b>When to Prioritize:</b> When sending an unqualified candidate forward causes severe consequences. For example, if a college directly refers a student to Google or Amazon, referring an unprepared student damages the university's placement reputation. In spam detection, marking a genuine job offer as spam is unacceptable.",
        "Example: If model predicted 50 students as ready (TP=45, FP=5):<br/>Precision = 45 / (45 + 5) = 45 / 50 = 90.0%"
    ))

    story.append(make_qa_box(
        8,
        "What is Recall (Sensitivity), and when is it more critical than Precision?",
        "Recall measures coverage: out of all truly ready students, how many did the model successfully identify. It is critical when False Negatives are dangerous.",
        "<b>Formula:</b> TP / (TP + FN)<br/>"
        "<b>When to Prioritize:</b> When missing a positive case carries a severe risk. For example, in medical diagnostics (cancer detection), predicting 'Negative' for a sick patient can be fatal. In student development, we cannot afford to miss students who need urgent intervention.",
        "Example: If 50 students were truly ready (TP=45, FN=5 missed):<br/>Recall = 45 / (45 + 5) = 45 / 50 = 90.0%"
    ))

    # PART 3: ADVANCED METRICS & CALCULATIONS
    story.append(Spacer(1, 10))
    story.append(Paragraph("PART 3: F1-Score, Live Math & Defense Rules", section_heading))

    story.append(make_qa_box(
        9,
        "What is F1-Score, and why do we use Harmonic Mean instead of Simple Average?",
        "F1-Score is the harmonic mean of Precision and Recall. We use the harmonic mean because it heavily penalizes extreme imbalances where one metric is high and the other is near zero.",
        "<b>Formula:</b> 2 × (Precision × Recall) / (Precision + Recall)<br/>"
        "<b>Why Harmonic Mean?</b> If Precision = 100% and Recall = 0%, the Arithmetic Mean is (100 + 0) / 2 = <b>50%</b> (a misleading score for a completely broken model). The Harmonic Mean gives: 2 × (1.0 × 0.0) / (1.0 + 0.0) = <b>0.0%</b>! It forces both Precision and Recall to be strong. Our model achieved an F1-score of <b>96.1%</b>.",
        "F1 = 2 × (P × R) / (P + R). For P=0.90, R=0.90 -> F1 = 1.62 / 1.80 = 90.0%"
    ))

    story.append(make_qa_box(
        10,
        "Live Calculation: Given TP=45, FP=5, FN=5, TN=45, calculate all 4 metrics on paper.",
        "Total sample size is 100 students. Accuracy, Precision, Recall, and F1-Score are all exactly 90.0%.",
        "Explain step-by-step to the examiner:<br/>"
        "1. Total = 45 + 5 + 5 + 45 = 100 students.<br/>"
        "2. <b>Accuracy</b> = (TP + TN) / Total = (45 + 45) / 100 = 90 / 100 = <b>90.0%</b><br/>"
        "3. <b>Precision</b> = TP / (TP + FP) = 45 / (45 + 5) = 45 / 50 = <b>90.0%</b><br/>"
        "4. <b>Recall</b> = TP / (TP + FN) = 45 / (45 + 5) = 45 / 50 = <b>90.0%</b><br/>"
        "5. <b>F1-Score</b> = 2 × (0.90 × 0.90) / (0.90 + 0.90) = 1.62 / 1.80 = <b>90.0%</b>",
        "Accuracy = 90.0% | Precision = 90.0% | Recall = 90.0% | F1 = 90.0%"
    ))

    story.append(make_qa_box(
        11,
        "What is Overfitting vs Underfitting, and how did you prevent it?",
        "Underfitting is high bias (model is too simple); Overfitting is high variance (model memorizes training noise). We prevented overfitting by ensembling 200 trees, capping tree depth at 5, and using an 80-20 Stratified Split.",
        "• <b>Underfitting:</b> Model cannot capture the underlying pattern (e.g. Logistic Regression on non-linear data).<br/>"
        "• <b>Overfitting:</b> Single Decision Tree learns every individual sample by heart. It achieves 100% on training data, but drops to 60% on test data.<br/>"
        "• <b>Prevention:</b> 1) Averaged 200 trees in Random Forest/Boosting, 2) Restricted max_depth to 5, 3) Split data 80% train / 20% test using <code>stratify=y</code>."
    ))

    story.append(make_qa_box(
        12,
        "Which features were most important in predicting student placement?",
        "Active Backlogs was the strongest negative factor, while Coding Proficiency and Technical Score were the strongest positive drivers.",
        "Feature Importance analysis revealed that having active backlogs immediately drops placement probability below 25%, as 80%+ of campus recruitment drives enforce a strict 0-backlog eligibility cutoff. Beyond eligibility, practical coding and technical CS competencies were the primary discriminators for final job offers."
    ))

    # PART 4: FORMULA CHEAT SHEET TABLE
    story.append(PageBreak())
    story.append(Paragraph("PART 4: Metric Formulas Quick Reference Cheat Sheet", section_heading))
    story.append(Paragraph("Keep this reference table in mind for instant answers during your viva examination:", subtitle_style))
    story.append(Spacer(1, 10))

    headers = [
        Paragraph("<b>Metric</b>", table_header_style),
        Paragraph("<b>Formula</b>", table_header_style),
        Paragraph("<b>Plain English Meaning</b>", table_header_style),
        Paragraph("<b>When to Prioritize</b>", table_header_style),
    ]

    table_data = [headers]

    rows = [
        ("Accuracy", "(TP + TN) / Total", "Percentage of total correct predictions out of all samples", "Balanced datasets with equal error costs"),
        ("Precision", "TP / (TP + FP)", "Fraction of positive predictions that were truly correct", "High cost of False Positives (Type I error)"),
        ("Recall (Sensitivity)", "TP / (TP + FN)", "Fraction of actual positive cases successfully caught", "High cost of False Negatives (Type II error)"),
        ("F1-Score", "2 × (P × R) / (P + R)", "Harmonic mean balancing precision and recall", "Imbalanced datasets; primary overall metric"),
        ("ROC-AUC", "Area under TPR vs FPR curve", "Discrimination capability independent of classification threshold", "Comparing model robustness across all thresholds"),
    ]

    for m, f, e, w in rows:
        table_data.append([
            Paragraph(f"<b>{m}</b>", table_cell_style),
            Paragraph(f"<code>{f}</code>", table_cell_style),
            Paragraph(e, table_cell_style),
            Paragraph(w, table_cell_style),
        ])

    cheat_table = Table(table_data, colWidths=[85, 135, 145, 130])
    cheat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(cheat_table)

    story.append(Spacer(1, 15))
    story.append(Paragraph("5 Spoken Golden Rules for Answering Examiners", section_heading))

    summary_text = (
        "<b>Rule 1 (Problem Type):</b> \"Sir, our system solves a Supervised Binary Classification task on 9 student competency features.\"<br/><br/>"
        "<b>Rule 2 (Model Choice):</b> \"We selected Gradient Boosting because tabular placement rules are non-linear (e.g. CGPA vs Backlogs) and tree ensembles don't require feature scaling, reaching 96.08% accuracy.\"<br/><br/>"
        "<b>Rule 3 (Accuracy Defense):</b> \"We evaluated F1-Score (96.1%) and ROC-AUC (0.985) alongside Accuracy to ensure reliable evaluation under class imbalance.\"<br/><br/>"
        "<b>Rule 4 (Overfitting Defense):</b> \"We prevented overfitting using an 80-20 Stratified Split (`stratify=y`), capping tree depth at 5 (`max_depth=5`), and ensembling 200 trees.\"<br/><br/>"
        "<b>Rule 5 (Business Impact):</b> \"False Positives are costly because recommending unprepared students directly to top companies leads to interview failures and damages institutional reputation.\""
    )
    story.append(Paragraph(summary_text, explanation_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Simple English PDF created: {pdf_filename}")

if __name__ == "__main__":
    build_pdf()
