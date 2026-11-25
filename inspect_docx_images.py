import docx

doc = docx.Document('LPU_Placement_Intelligence_IEEE_Paper.docx')
for i in range(64, 82):
    p = doc.paragraphs[i]
    has_graphic = any('graphic' in r._element.xml for r in p.runs)
    print(f'P{i}: text="{p.text[:40]}" has_graphic={has_graphic}')
