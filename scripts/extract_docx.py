import os, sys, docx

sys.stdout.reconfigure(encoding='utf-8')

def docx_to_markdown(docx_path):
    doc = docx.Document(docx_path)
    md_lines = []
    
    # Iterate through body elements (paragraphs and tables)
    for element in doc.element.body:
        if element.tag.endswith('p'):
            # It's a paragraph
            p = docx.text.paragraph.Paragraph(element, doc)
            text = p.text.strip()
            if not text:
                continue
            
            style_name = p.style.name.lower()
            if 'title' in style_name:
                md_lines.append(f"# {text}\n")
            elif 'heading 1' in style_name:
                md_lines.append(f"\n## {text}\n")
            elif 'heading 2' in style_name:
                md_lines.append(f"\n### {text}\n")
            elif 'heading 3' in style_name:
                md_lines.append(f"\n#### {text}\n")
            elif 'heading 4' in style_name:
                md_lines.append(f"\n##### {text}\n")
            elif p.style.name.startswith('List'):
                md_lines.append(f"- {text}")
            else:
                # Reconstruct bold if any
                runs_text = []
                for r in p.runs:
                    t = r.text
                    if r.bold and t.strip():
                        runs_text.append(f"**{t.strip()}** ")
                    else:
                        runs_text.append(t)
                reconstructed = "".join(runs_text).strip()
                if reconstructed:
                    md_lines.append(reconstructed)
                    
        elif element.tag.endswith('tbl'):
            # It's a table
            tbl = docx.table.Table(element, doc)
            rows = tbl.rows
            if not rows:
                continue
            
            # Extract table cells
            table_data = []
            for row in rows:
                row_cells = [cell.text.strip().replace('\n', ' ') for cell in row.cells]
                # Deduplicate merged cells
                cleaned_row = []
                for idx, c in enumerate(row_cells):
                    if idx > 0 and c == row_cells[idx - 1] and len(c) > 0:
                        cleaned_row.append("")
                    else:
                        cleaned_row.append(c)
                table_data.append(cleaned_row)
            
            if table_data:
                headers = table_data[0]
                md_lines.append("\n| " + " | ".join(headers) + " |")
                md_lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
                for r in table_data[1:]:
                    # Ensure matching column count
                    while len(r) < len(headers):
                        r.append("")
                    md_lines.append("| " + " | ".join(r[:len(headers)]) + " |")
                md_lines.append("")
                
    return "\n".join(md_lines)

if __name__ == '__main__':
    src = r'D:\google driver\Tài liệu\cho AI đọc\file pdf, doc\Chất dinh dưỡng.docx'
    res = docx_to_markdown(src)
    print(f"Chất dinh dưỡng.docx extracted: {len(res)} characters, {len(res.splitlines())} lines")
    print("\nSample first 30 lines:")
    for l in res.splitlines()[:30]:
        print(l)
