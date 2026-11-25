"""
Presentation Generator — 100% Simple English Version.
Designed for presentations, viva defense, and clear spoken delivery.
"""

import sys
import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme colors
    BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    CARD_BG = RGBColor(30, 41, 59)       # Slate 800
    CARD_BORDER = RGBColor(51, 65, 85)   # Slate 700
    ACCENT_BLUE = RGBColor(56, 189, 248) # Sky 400
    ACCENT_CYAN = RGBColor(6, 182, 212)  # Cyan 500
    ACCENT_GREEN = RGBColor(52, 211, 153)# Emerald 400
    ACCENT_AMBER = RGBColor(251, 191, 36)# Amber 400
    ACCENT_ROSE = RGBColor(248, 113, 113)# Rose 400
    TEXT_LIGHT = RGBColor(241, 245, 249) # Slate 100
    TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
    WHITE = RGBColor(255, 255, 255)

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag_text, title_text, subtitle_text):
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(2.8), Inches(0.35))
        tag.fill.solid()
        tag.fill.fore_color.rgb = RGBColor(30, 58, 138)
        tag.line.color.rgb = ACCENT_BLUE
        p_tag = tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_BLUE
        p_tag.alignment = PP_ALIGN.CENTER

        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.6))
        tf_title = tb_title.text_frame
        tf_title.word_wrap = True
        p_t = tf_title.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = WHITE

        if subtitle_text:
            tb_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.35), Inches(11.7), Inches(0.4))
            tf_sub = tb_sub.text_frame
            tf_sub.word_wrap = True
            p_s = tf_sub.paragraphs[0]
            p_s.text = subtitle_text
            p_s.font.size = Pt(12)
            p_s.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 1: Cover Slide
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.1))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ACCENT_BLUE
    bar.line.fill.background()

    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.0), Inches(3.4), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(30, 58, 138)
    pill.line.color.rgb = ACCENT_BLUE
    p_pill = pill.text_frame.paragraphs[0]
    p_pill.text = "MACHINE LEARNING VIVA & DEFENSE"
    p_pill.font.size = Pt(11)
    p_pill.font.bold = True
    p_pill.font.color.rgb = ACCENT_BLUE
    p_pill.alignment = PP_ALIGN.CENTER

    tb_m = s1.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.3), Inches(1.8))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True
    p1 = tf_m.paragraphs[0]
    p1.text = "Machine Learning: Model Selection & Metrics"
    p1.font.size = Pt(34)
    p1.font.bold = True
    p1.font.color.rgb = WHITE
    p2 = tf_m.add_paragraph()
    p2.text = "Why Use Which Model, Key Decision Factors, and Step-by-Step Math"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT_CYAN

    tb_sub = s1.shapes.add_textbox(Inches(1.0), Inches(3.6), Inches(11.3), Inches(0.8))
    tf_sub = tb_sub.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = "Clear, simple explanations for presentations and viva examinations — easy to understand, easy to explain."
    p_sub.font.size = Pt(14)
    p_sub.font.color.rgb = TEXT_MUTED

    cards = [
        ("1. Model Selection", "Why choose Gradient Boosting & Random Forest over Logistic Regression or SVM?", ACCENT_CYAN),
        ("2. Decision Factors", "Data size, tabular structure, non-linear relationships, and overfitting prevention.", ACCENT_AMBER),
        ("3. Metrics & Calculations", "Confusion Matrix, the Accuracy Paradox, Precision vs Recall, and F1-Score.", ACCENT_GREEN),
    ]
    for i, (head, desc, col) in enumerate(cards):
        cx = Inches(1.0 + i * 3.85)
        cy = Inches(4.7)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(3.6), Inches(2.0))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        tf_c = card.text_frame
        tf_c.word_wrap = True
        p_ch = tf_c.paragraphs[0]
        p_ch.text = head
        p_ch.font.size = Pt(15)
        p_ch.font.bold = True
        p_ch.font.color.rgb = col
        
        p_cd = tf_c.add_paragraph()
        p_cd.text = "\n" + desc
        p_cd.font.size = Pt(12)
        p_cd.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 2: 4 Key Factors for Model Selection
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "Selection Criteria", "4 Factors to Consider Before Choosing an ML Model",
               "Examiner Question: 'What factors did you consider before choosing your algorithm?'")

    f_cards = [
        ("1. Nature of the Target", "Classification vs Regression", "If the target is discrete categories (Placed vs Not Placed), use Classification. If the target is a continuous number (Salary Package in LPA), use Regression.", ACCENT_CYAN),
        ("2. Data Format & Size", "Tabular vs Unstructured", "For tabular data (rows and columns like marks, coding scores, backlogs), Tree Ensembles (Random Forest / Gradient Boosting) are the proven gold standard. Neural networks require huge unstructured data (images/audio).", ACCENT_BLUE),
        ("3. Linearity vs Non-Linearity", "Can a straight line separate classes?", "Placement rules are non-linear: a student with 9.5 CGPA but 2 active backlogs gets disqualified. Linear models fail here; tree models handle compound IF-ELSE rules naturally.", ACCENT_AMBER),
        ("4. Overfitting & Generalization", "Single Tree vs 200 Trees", "A single Decision Tree memorizes training noise (high variance). Ensemble models combine 200 trees to average out mistakes and generalize to unseen students.", ACCENT_GREEN),
    ]

    for idx, (title, sub, body, color) in enumerate(f_cards):
        row = idx // 2
        col = idx % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.8 + row * 2.6)

        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.2)

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MUTED

        p3 = tf.add_paragraph()
        p3.text = "\n" + body
        p3.font.size = Pt(11.5)
        p3.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 3: Algorithm Showdown (Simple Comparison)
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "Algorithm Showdown", "Why Use Which Model? (Pros, Cons & Best Use Cases)",
               "Comparing the 4 major classification algorithms evaluated on our data:")

    s_models = [
        ("Logistic Regression", "Linear Baseline", "Fast, mathematically simple, draws a single linear boundary. Fails when data has complex interactions (Underfitting).", "78.43% Accuracy | Baseline only", ACCENT_MUTED := RGBColor(148, 163, 184)),
        ("Decision Tree", "Rule-Based Flowchart", "Intuitive IF-ELSE rules. Does not require feature scaling. However, it overfits heavily on training data (High Variance).", "84.31% Accuracy | Prone to overfitting", ACCENT_AMBER),
        ("Random Forest", "Bagging (Parallel Trees)", "Builds 200 independent trees and takes a majority vote. Highly stable, eliminates single-tree overfitting.", "94.12% Accuracy | Production reliable", ACCENT_GREEN),
        ("Gradient Boosting (Winner)", "Boosting (Sequential Trees)", "Builds trees sequentially; each new tree corrects the residual errors of earlier trees. State-of-the-art on tabular data.", "96.08% Accuracy | 96.1% F1 (Selected)", ACCENT_CYAN),
    ]

    for idx, (m_name, m_type, m_desc, m_score, m_col) in enumerate(s_models):
        row = idx // 2
        col = idx % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(1.8 + row * 2.6)

        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = m_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.2)

        p1 = tf.paragraphs[0]
        p1.text = m_name
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = m_col

        p2 = tf.add_paragraph()
        p2.text = f"Type: {m_type}"
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_MUTED

        p3 = tf.add_paragraph()
        p3.text = "\n" + m_desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_LIGHT

        p4 = tf.add_paragraph()
        p4.text = f"\nBenchmark Result: {m_score}"
        p4.font.size = Pt(11)
        p4.font.bold = True
        p4.font.color.rgb = m_col

    # -------------------------------------------------------------
    # SLIDE 4: Confusion Matrix Explained
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "Evaluation Foundation", "The Confusion Matrix: The 4-Quadrant Report Card",
               "Every metric (Accuracy, Precision, Recall, F1) originates from these 4 outcomes:")

    c_quads = [
        ("True Positive (TP)", "CORRECT SUCCESS HIT", "Model predicted: READY (1) | Actual: READY (1)\nThe model correctly identified a student who was hired during campus placements.", ACCENT_GREEN, Inches(0.8), Inches(1.8)),
        ("False Positive (FP) - Type I", "DANGEROUS FALSE ALARM", "Model predicted: READY (1) | Actual: NOT READY (0)\nDangerous: The model falsely marked an unprepared student as ready, leading to rejection in interviews.", ACCENT_ROSE, Inches(6.8), Inches(1.8)),
        ("False Negative (FN) - Type II", "MISSED TALENT", "Model predicted: NOT READY (0) | Actual: READY (1)\nMissed opportunity: The student was actually capable, but the model incorrectly flagged them as not ready.", ACCENT_AMBER, Inches(0.8), Inches(4.4)),
        ("True Negative (TN)", "CORRECT WARNING", "Model predicted: NOT READY (0) | Actual: NOT READY (0)\nAccurate diagnosis: The model recognized skill deficiencies early so remedial training could be assigned.", ACCENT_BLUE, Inches(6.8), Inches(4.4)),
    ]

    for q_t, q_sub, q_d, q_col, qx, qy in c_quads:
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, qx, qy, Inches(5.75), Inches(2.35))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = q_col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.2)

        p1 = tf.paragraphs[0]
        p1.text = q_t
        p1.font.size = Pt(15)
        p1.font.bold = True
        p1.font.color.rgb = q_col

        p2 = tf.add_paragraph()
        p2.text = q_sub
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = WHITE

        p3 = tf.add_paragraph()
        p3.text = "\n" + q_d
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 5: Accuracy vs Precision vs Recall
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "Core Metrics", "Accuracy vs Precision vs Recall: Clear Formulas & Meaning",
               "Examiner Question: 'What is the exact difference between Precision, Recall, and Accuracy?'")

    m_triplet = [
        ("ACCURACY", "Formula: (TP + TN) / Total", "(TP + TN) / (TP + TN + FP + FN)",
         "Plain Meaning:\nPercentage of total correct predictions out of all tested students (both Ready & Not Ready).",
         "THE TRAP:\nMisleading on imbalanced datasets. If 95% fail and model predicts 'Fail' for all, Accuracy is 95% but model is useless!",
         ACCENT_CYAN, Inches(0.8)),

        ("PRECISION", "Formula: TP / (TP + FP)", "TP / (TP + FP)",
         "Plain Meaning:\nOut of all students the model labeled as 'Ready', how many were truly ready?",
         "WHEN TO PRIORITIZE:\nWhen False Positives are expensive (e.g., direct company referral or high-stakes recommendations).",
         ACCENT_AMBER, Inches(4.8)),

        ("RECALL (Sensitivity)", "Formula: TP / (TP + FN)", "TP / (TP + FN)",
         "Plain Meaning:\nOut of all truly ready students in the college, what percentage did the model successfully catch?",
         "WHEN TO PRIORITIZE:\nWhen False Negatives are dangerous (e.g., catching struggling students who need urgent remedial training).",
         ACCENT_GREEN, Inches(8.8)),
    ]

    for title, f_label, form, desc, warn, col, x_pos in m_triplet:
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, Inches(1.8), Inches(3.75), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = col
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.3)

        p1 = tf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = f_label
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = WHITE

        p3 = tf.add_paragraph()
        p3.text = f"\n[ {form} ]"
        p3.font.size = Pt(11.5)
        p3.font.bold = True
        p3.font.color.rgb = ACCENT_CYAN

        p4 = tf.add_paragraph()
        p4.text = "\n" + desc
        p4.font.size = Pt(11)
        p4.font.color.rgb = TEXT_LIGHT

        p5 = tf.add_paragraph()
        p5.text = "\n" + warn
        p5.font.size = Pt(10.5)
        p5.font.color.rgb = col

    # -------------------------------------------------------------
    # SLIDE 6: F1-Score & Why Harmonic Mean
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "Balanced Performance", "F1-Score: Why Do We Use Harmonic Mean?",
               "Examiner Trick Question: 'Why use Harmonic Mean instead of standard Arithmetic Mean?'")

    l_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.75), Inches(5.1))
    l_card.fill.solid()
    l_card.fill.fore_color.rgb = CARD_BG
    l_card.line.color.rgb = ACCENT_CYAN
    l_card.line.width = Pt(1.5)

    tf_l = l_card.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = Inches(0.35)
    tf_l.margin_right = Inches(0.35)
    tf_l.margin_top = Inches(0.3)

    p_lh = tf_l.paragraphs[0]
    p_lh.text = "Simple Average vs Harmonic Mean"
    p_lh.font.size = Pt(16)
    p_lh.font.bold = True
    p_lh.font.color.rgb = ACCENT_CYAN

    p_lb = tf_l.add_paragraph()
    p_lb.text = (
        "\n1. Arithmetic Mean Conceals Flaws:\n"
        "• Suppose Precision = 100%, but Recall = 0% (model missed every student!).\n"
        "• Standard Average = (100% + 0%) / 2 = 50%!\n"
        "• 50% gives a false impression of moderate performance for a broken model.\n\n"
        "2. Harmonic Mean Exposes Severe Weaknesses:\n"
        "• Harmonic Mean heavily penalizes extreme low scores:\n"
        "  F1 = 2 × (1.0 × 0.0) / (1.0 + 0.0) = 0.0% !!\n\n"
        "Golden Rule:\n"
        "F1-Score is high ONLY when BOTH Precision and Recall are strong."
    )
    p_lb.font.size = Pt(11.5)
    p_lb.font.color.rgb = TEXT_LIGHT

    r_card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.75), Inches(5.1))
    r_card.fill.solid()
    r_card.fill.fore_color.rgb = CARD_BG
    r_card.line.color.rgb = ACCENT_GREEN
    r_card.line.width = Pt(1.5)

    tf_r = r_card.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = Inches(0.35)
    tf_r.margin_right = Inches(0.35)
    tf_r.margin_top = Inches(0.3)

    p_rh = tf_r.paragraphs[0]
    p_rh.text = "Our Project F1 Benchmark"
    p_rh.font.size = Pt(16)
    p_rh.font.bold = True
    p_rh.font.color.rgb = ACCENT_GREEN

    p_rb = tf_r.add_paragraph()
    p_rb.text = (
        "\nFORMULA:\n"
        "F1 = 2 × (Precision × Recall) / (Precision + Recall)\n\n"
        "Our Gradient Boosting Results:\n"
        "• Accuracy   : 96.08%\n"
        "• Precision  : 96.20%\n"
        "• Recall     : 96.00%\n"
        "• F1-Score   : 96.10%\n"
        "• ROC-AUC    : 0.985\n\n"
        "Viva Spoken Line:\n"
        "'Sir, our F1-score of 96.1% proves that both False Positives and False Negatives are minimized, ensuring reliable student classification.'"
    )
    p_rb.font.size = Pt(12)
    p_rb.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 7: Step-by-Step Live Math
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "Practical Math", "Live Viva Calculation: 4 Simple Steps on Paper",
               "Examiner: 'Take a pen and paper. If TP=45, FP=5, FN=5, TN=45, calculate all metrics.'")

    gl_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(4.0), Inches(5.1))
    gl_card.fill.solid()
    gl_card.fill.fore_color.rgb = CARD_BG
    gl_card.line.color.rgb = ACCENT_AMBER
    gl_card.line.width = Pt(1.5)

    tf_gl = gl_card.text_frame
    tf_gl.word_wrap = True
    tf_gl.margin_left = Inches(0.3)
    tf_gl.margin_right = Inches(0.3)
    tf_gl.margin_top = Inches(0.3)

    p_glh = tf_gl.paragraphs[0]
    p_glh.text = "Given Confusion Matrix"
    p_glh.font.size = Pt(15)
    p_glh.font.bold = True
    p_glh.font.color.rgb = ACCENT_AMBER

    p_glb = tf_gl.add_paragraph()
    p_glb.text = (
        "\nTotal Test Sample = 100 Students\n\n"
        "• TP (True Positives)  = 45\n"
        "• FP (False Positives) = 5\n"
        "• FN (False Negatives) = 5\n"
        "• TN (True Negatives)  = 45\n\n"
        "Total = 45 + 5 + 5 + 45 = 100"
    )
    p_glb.font.size = Pt(12)
    p_glb.font.color.rgb = WHITE

    gr_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.1), Inches(1.8), Inches(7.4), Inches(5.1))
    gr_card.fill.solid()
    gr_card.fill.fore_color.rgb = CARD_BG
    gr_card.line.color.rgb = ACCENT_GREEN
    gr_card.line.width = Pt(1.5)

    tf_gr = gr_card.text_frame
    tf_gr.word_wrap = True
    tf_gr.margin_left = Inches(0.35)
    tf_gr.margin_right = Inches(0.35)
    tf_gr.margin_top = Inches(0.3)

    p_grh = tf_gr.paragraphs[0]
    p_grh.text = "Step-by-Step Live Calculation"
    p_grh.font.size = Pt(15)
    p_grh.font.bold = True
    p_grh.font.color.rgb = ACCENT_GREEN

    steps = [
        ("Step 1: Accuracy", "Accuracy = (TP + TN) / Total\n= (45 + 45) / 100 = 90 / 100 = 90.0%"),
        ("Step 2: Precision", "Precision = TP / (TP + FP)\n= 45 / (45 + 5) = 45 / 50 = 90.0%  (Out of 50 predicted ready, 45 were truly ready)"),
        ("Step 3: Recall", "Recall = TP / (TP + FN)\n= 45 / (45 + 5) = 45 / 50 = 90.0%  (Out of 50 truly ready, model identified 45)"),
        ("Step 4: F1-Score", "F1 = 2 × (Precision × Recall) / (Precision + Recall)\n= 2 × (0.90 × 0.90) / (0.90 + 0.90) = 1.62 / 1.80 = 90.0%"),
    ]
    for s_title, s_calc in steps:
        p_st = tf_gr.add_paragraph()
        p_st.text = f"\n{s_title}"
        p_st.font.size = Pt(12)
        p_st.font.bold = True
        p_st.font.color.rgb = ACCENT_CYAN

        p_sc = tf_gr.add_paragraph()
        p_sc.text = s_calc
        p_sc.font.size = Pt(11)
        p_sc.font.color.rgb = TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 8: 4 Essential Viva Defense Lines
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_header(s8, "Viva Defense", "4 Core Questions Asked by Examiners & Exact Spoken Answers",
               "Memorize these 4 direct lines to answer questions with total confidence:")

    qas = [
        ("Q1: Why did you choose Gradient Boosting & Random Forest?",
         "Answer: 'Sir, campus placement readiness is non-linear—for instance, a high CGPA cannot compensate for active backlogs. Tree ensembles naturally learn compound IF-ELSE criteria without requiring feature scaling, achieving 96% accuracy.'",
         ACCENT_CYAN),
        ("Q2: If accuracy is 95%, is the model always good?",
         "Answer: 'No, Sir. On imbalanced data where 95% fail, a naive model predicting Fail for everyone achieves 95% accuracy with 0% Recall. That is why we evaluate F1-score and ROC-AUC.'",
         ACCENT_AMBER),
        ("Q3: How did you prevent overfitting?",
         "Answer: 'We used an ensemble of 200 trees rather than a single tree, restricted tree depth to 5 (max_depth=5), and trained with an 80-20 Stratified train-test split.'",
         ACCENT_GREEN),
        ("Q4: Which feature influenced predictions the most?",
         "Answer: 'Active Backlogs was the strongest negative factor (0 backlogs is mandatory for most campus drives), while Coding Proficiency and Technical Score were the top positive factors.'",
         ACCENT_ROSE),
    ]

    for idx, (q_text, a_text, q_col) in enumerate(qas):
        y_pos = Inches(1.8 + idx * 1.3)
        box = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y_pos, Inches(11.7), Inches(1.15))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = q_col
        box.line.width = Pt(1.5)

        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.12)

        p1 = tf.paragraphs[0]
        p1.text = q_text
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = q_col

        p2 = tf.add_paragraph()
        p2.text = a_text
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_LIGHT

    out_file = "ML_Model_Selection_And_Metrics_Guide.pptx"
    prs.save(out_file)
    print(f"Simple English PPT created: {out_file} ({len(prs.slides)} slides)")

if __name__ == "__main__":
    create_deck()
