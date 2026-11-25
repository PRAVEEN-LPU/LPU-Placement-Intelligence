import docx
from docx.shared import Inches
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DOCX_PATH = 'LPU_Placement_Intelligence_IEEE_Paper.docx'
doc = docx.Document(DOCX_PATH)

# Map paragraph indices to replacement images
image_updates = {
    66: ('screenshots/fig0_tri_role_login.png', Inches(3.30)),
    69: ('screenshots/composites/fig1_pair_student_readiness.png', Inches(3.30)),
    72: ('screenshots/composites/fig2_pair_remediation_roadmap.png', Inches(3.30)),
    75: ('screenshots/composites/fig3_pair_mentor_intervention.png', Inches(3.30)),
    78: ('screenshots/composites/fig4_pair_admin_governance.png', Inches(3.30)),
}

for p_idx, (img_path, width) in image_updates.items():
    if not os.path.exists(img_path):
        print(f"Warning: {img_path} does not exist!")
        continue
    p = doc.paragraphs[p_idx]
    # Clear existing runs in the image paragraph
    p.text = ''
    run = p.add_run()
    run.add_picture(img_path, width=width)
    p.alignment = docx.enum.text.WD_ALIGN_PARAGRAPH.CENTER
    print(f"Updated image in P{p_idx} with {img_path}")

# Update text in P71 to reflect 3D zigzag highway and walking man animation
p71 = doc.paragraphs[71]
p71.text = (
    "C. Interactive 3D Zigzag Highway Roadmap & Competency Remediation — To translate raw probability estimates "
    "into concrete, student-driven remediation, the platform provides dual execution tools: an 8-Dimension "
    "Competency Skill Gap Matrix and an animated Target-Driven Career Highway Roadmap (Fig. 3). The gap matrix in "
    "Fig. 3(a) benchmarks candidate capabilities across Academics (CGPA), Coding Proficiency, Technical Knowledge, "
    "Aptitude & Reasoning, Communication & HR Fit, Practical Projects, Industry Internships, Backlogs, and "
    "Certifications, flagging critical deficiencies with high-priority triage tags. The Career Highway Roadmap in "
    "Fig. 3(b) models preparation as an interactive 3D zigzag highway track with animated center lane dividers, "
    "dynamic vehicle progress indicator, and six sequential stoppage milestones: Stop 01 (Academic & Eligibility "
    "Gateway, CGPA ≥ 7.50, 0 Backlogs), Stop 02 (DSA Mile, Coding ≥ 75%, 150+ problems), Stop 03 (CS Core Systems "
    "Hub, OS/DBMS/CN ≥ 75%), Stop 04 (Full-Stack Project Sprint, ≥ 2 production projects), Stop 05 (Aptitude & Speed "
    "Reasoning Checkpoint, Aptitude ≥ 70%), and Stop 06 (Corporate HR & Soft Skills Summit, Communication ≥ 70%). "
    "When a student interactively toggles milestone checkboxes ('Mark Tick if Completed'), a 3D animated walking "
    "character traverses the zigzag road path toward the newly achieved stoppage, advancing candidate readiness "
    "toward the Campus Dream Placement Offer finish line (8–24+ LPA) with automatic persistent synchronization."
)

# Update caption in P73
p73 = doc.paragraphs[73]
p73.text = (
    "Fig. 3. Competency Remediation & Target-Driven Execution — (a) 9-Dimension Skill Gap Matrix evaluating "
    "candidate metrics against corporate hiring benchmarks with automated priority triage indicators; (b) "
    "Interactive 3D Zigzag Highway Career Roadmap featuring animated zigzag road canvas, six sequential stoppage "
    "milestones, 3D animated walking character progression upon milestone completion, checkable toggles, and "
    "dynamic vehicle progress indicator."
)

doc.save(DOCX_PATH)
print("Saved updated DOCX successfully!")

# Convert to PDF
try:
    import docx2pdf
    pdf_path = 'LPU_Placement_Intelligence_IEEE_Paper.pdf'
    print("Converting DOCX to PDF via docx2pdf...")
    docx2pdf.convert(DOCX_PATH, pdf_path)
    print(f"Generated {pdf_path} successfully!")
except Exception as e:
    print(f"PDF conversion note: {e}")
