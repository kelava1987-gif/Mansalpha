from pathlib import Path
import json, re, subprocess, shutil
from concurrent.futures import ThreadPoolExecutor
import pymupdf as fitz
from PIL import Image

ROOT = Path('/home/ubuntu/mansalpha')
OUT = ROOT / 'imports' / 'prepared'
OUT.mkdir(parents=True, exist_ok=True)
DOCS = [
 ('osvijetljeni', 'OsvijetljeninacrtAI-ja2.pdf', 'mansalpha-obrasci-ai.pdf'),
 ('too-much', 'WhenAIKnowsTooMuch(1).pdf', 'mansalpha-digitalno-povjerenje.pdf'),
 ('dignity', 'AIandHumanDignity.pdf', 'mansalpha-ai-dostojanstvo.pdf'),
 ('equilibrium', 'ArchitectureofEquilibrium(1).pdf', 'mansalpha-arhitektura-ravnoteze.pdf'),
 ('mentalno', 'Suvremenaarhitekturamentalnogzdravlja(2).pdf', 'mansalpha-mentalno-zdravlje.pdf'),
 ('crisis', 'PsychologyinCrisis(1).pdf', 'mansalpha-sjene-psihologije.pdf'),
 ('stvarnost-ai', 'Stvarnostumjetneinteligencije2.pdf', 'mansalpha-stvarnost-ai.pdf'),
]
items = []
for ident, source, name in DOCS:
    doc = fitz.open(Path('/home/ubuntu/upload') / source)
    if ident == 'too-much':
        # These three source pages contain private narratives or sensitive logs.
        # Their general educational content is retained in the redacted text record.
        doc.delete_pages([5, 9, 10])
    if ident == 'dignity':
        page = doc[-1]
        rect = fitz.Rect(565, 660, 816, 729)
        page.add_redact_annot(rect, fill=(0.023, 0.145, 0.247))
        page.apply_redactions()
        page.insert_textbox(rect, 'Mansalpha', fontsize=22, fontname='helv', color=(0.9,0.93,0.92), align=1)
    doc.set_metadata({'title':json.load(open(ROOT / 'imports' / f'{ident}.json'))['title'], 'subject':'Mansalpha — edukativni materijal'})
    target = OUT / name
    doc.save(target, garbage=4, deflate=True)
    doc.close()
    items.append((ident, target))
    if ident not in ('dignity', 'too-much'):
        cover_doc = fitz.open(target)
        pix = cover_doc[0].get_pixmap(matrix=fitz.Matrix(0.75,0.75))
        cover = OUT / f'{ident}-cover.jpg'
        pix.pil_save(cover, format='JPEG', quality=88)
        items.append((f'{ident}-cover',cover))
        cover_doc.close()

control = fitz.open(ROOT / 'imports/assets/psihologija-kontrole.pdf')
for page in control:
    rects = page.search_for('KREIRAO: UREDNIŠTVO WWW.STVARNASLIKA.COM')
    for rect in rects:
        expanded = rect + (-2,-2,2,2)
        page.add_redact_annot(expanded, fill=(1,1,1))
        page.apply_redactions()
        page.insert_text((rect.x0,rect.y1-2), 'MANSALPHA', fontsize=9, color=(0.22,0.38,0.30))
control.set_metadata({'title':'Psihologija kontrole — Mansalpha'})
control.save(OUT / 'mansalpha-psihologija-kontrole.pdf', garbage=4, deflate=True)
control.close()
items.append(('psihologija-kontrole', OUT / 'mansalpha-psihologija-kontrole.pdf'))
shutil.copyfile(ROOT / 'imports/assets/ovisnosti-lijecenje.pptx', OUT / 'mansalpha-ovisnosti-lijecenje.pptx')
items.append(('ovisnosti-droge-lijecenje', OUT / 'mansalpha-ovisnosti-lijecenje.pptx'))
shutil.copyfile(ROOT / 'imports/assets/mansalpha-percepcija.mp4', OUT / 'mansalpha-percepcija.mp4')
items.append(('consciousness-motion-loop', OUT / 'mansalpha-percepcija.mp4'))
for name in ['medical-hero-light_c018e005.jpg','medical-neuroscience-light_dd170033.jpg','medical-research-light_9e6211b8.jpg','parapsych-ganzfeld_d229af4c.jpg','parapsych-near-death_40203c46.jpg','parapsych-psychokinesis_5ac78b1f.jpg']:
    image=Image.open(ROOT / 'imports/assets' / name).convert('RGB')
    image.thumbnail((1400,1400))
    target=OUT / name.replace('.jpg','.webp')
    image.save(target,'WEBP',quality=86)
    items.append((name,target))
image=Image.open(ROOT / 'imports/video-frame.jpg')
image.thumbnail((960,960))
image.save(OUT / 'percepcija-cover.webp','WEBP',quality=86)
items.append(('video-cover',OUT / 'percepcija-cover.webp'))

receipt=ROOT / 'imports/asset-storage.json'
existing=json.load(open(receipt)) if receipt.exists() else {}
def upload(item):
    ident, path = item
    if ident in existing: return ident,existing[ident]
    proc=subprocess.run(['manus-upload-file','--webdev',str(path)],capture_output=True,text=True,timeout=180)
    if proc.returncode: raise RuntimeError(f'Upload failed {ident}: {proc.stdout} {proc.stderr}')
    match=re.search(r'Storage Path:\s*(/manus-storage/\S+)',proc.stdout)
    if not match: raise RuntimeError(f'Upload response missing path for {ident}')
    print(f'Uploaded {ident}: {path.stat().st_size} bytes',flush=True)
    return ident,match.group(1)
for ident,url in ThreadPoolExecutor(max_workers=4).map(upload,items):
    existing[ident]=url
    receipt.write_text(json.dumps(existing,ensure_ascii=False,indent=2)+'\n')
print('Prepared and uploaded',len(items),'assets.',flush=True)
