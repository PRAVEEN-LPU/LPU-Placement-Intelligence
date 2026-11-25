from PIL import Image, ImageDraw, ImageFont
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('screenshots/composites', exist_ok=True)

def create_pair(img_left_path, img_right_path, label_left, label_right, out_path, target_h=1000):
    img_l = Image.open(img_left_path)
    img_r = Image.open(img_right_path)
    
    scale_l = target_h / img_l.height
    scale_r = target_h / img_r.height
    
    new_w_l = int(img_l.width * scale_l)
    new_w_r = int(img_r.width * scale_r)
    
    img_l_resized = img_l.resize((new_w_l, target_h), Image.Resampling.LANCZOS)
    img_r_resized = img_r.resize((new_w_r, target_h), Image.Resampling.LANCZOS)
    
    header_h = 55
    border = 10
    gap = 18
    total_w = new_w_l + new_w_r + gap + 2 * border
    total_h = target_h + header_h + 2 * border
    
    canvas = Image.new('RGB', (total_w, total_h), (10, 15, 30))
    draw = ImageDraw.Draw(canvas)
    
    try:
        font = ImageFont.truetype('arial.ttf', 28)
    except:
        font = ImageFont.load_default()
        
    x_l = border
    y_img = border + header_h
    canvas.paste(img_l_resized, (x_l, y_img))
    draw.text((x_l + 12, border + 12), label_left, fill=(224, 231, 255), font=font)
    
    x_r = border + new_w_l + gap
    canvas.paste(img_r_resized, (x_r, y_img))
    draw.text((x_r + 12, border + 12), label_right, fill=(224, 231, 255), font=font)
    
    # Separation line
    draw.line([(border + new_w_l + gap // 2, border), (border + new_w_l + gap // 2, total_h - border)], fill=(45, 55, 75), width=2)
    
    canvas.save(out_path, quality=95)
    print(f'Generated: {out_path} -> {total_w}x{total_h}')

create_pair(
    'screenshots/fig1_student_needs_focus.png',
    'screenshots/fig2_student_top_performer.png',
    '(a) Developing Candidate Profile (44% Calibrated Readiness, Needs Focus)',
    '(b) Benchmark Top Performer Profile (100% Readiness, Placement Ready)',
    'screenshots/composites/fig1_pair_student_readiness.png'
)

create_pair(
    'screenshots/fig3_skill_gap_matrix.png',
    'screenshots/fig4_3d_zigzag_mountain_roadmap.png',
    '(a) 9-Dimension Competency Skill Gap Matrix',
    '(b) Interactive 3D Zigzag Mountain Highway Roadmap & Walking Character',
    'screenshots/composites/fig2_pair_remediation_roadmap.png'
)

create_pair(
    'screenshots/fig5_mentor_cohort_roster.png',
    'screenshots/fig6_mentor_mentee_drilldown.png',
    '(a) Assigned Cohort Support Roster & Triage Queue',
    '(b) Individual Mentee Diagnostic Drilldown & Evidence',
    'screenshots/composites/fig3_pair_mentor_intervention.png'
)

create_pair(
    'screenshots/fig7_admin_placement_pipeline.png',
    'screenshots/fig8_admin_model_monitoring.png',
    '(a) Institutional Placement Recruitment Pipeline Funnel',
    '(b) Algorithmic Model Governance & Monitoring Dashboard',
    'screenshots/composites/fig4_pair_admin_governance.png'
)

print('All paired composites updated with 3D Mountain Roadmap!')
