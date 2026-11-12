from pathlib import Path
import json,re
ROOT=Path('/home/ubuntu/mansalpha')
assets=json.load(open(ROOT/'imports/asset-storage.json'))
website=json.load(open(ROOT/'imports/website.json'))
HERO='/manus-storage/async-images/zVDFsNTPtC5g956jbv7Ft7/image-1.webp'
DIGNITY='/manus-storage/async-images/zVDFsNTPtC5g956jbv7Ft7/image-2.webp'
records=[]

def clean(text):
    text=re.sub(r'stvarna\s+slika','Mansalpha',text,flags=re.I)
    text=text.replace("Kada govorimo o 'stvarnoj slici'",'Kada govorimo o cjelovitom razumijevanju')
    text=re.sub(r'https?://(?:www\.)?stvarnaslika\.[^\s)]+','[izvorna poveznica arhivirana]',text,flags=re.I)
    return text

def make_record(**kw):
    record=dict(id='',title='',kind='article',summary='',content='',topics=[],status='u izradi',assetUrl='',imageUrl='',videoUrl='',format='',sourceNote='')
    record.update(kw)
    return record

for ident in ['dignity','mentalno','osvijetljeni','too-much','equilibrium','crisis','stvarnost-ai']:
    doc=json.load(open(ROOT/'imports'/f'{ident}.json'))
    specific=''
    if ident=='too-much':
        specific='Privatni kontekst nije uključen. PDF sadrži samo šest odabranih općih edukativnih stranica, bez osobnog slučaja, datuma, identifikatora i zapisa. Tekst je urednički prilagođen istom ograničenju.'
    if ident=='dignity':
        specific='Religijske i filozofske teze predstavljaju motrište izvornika. Navod o enciklici „Magnifica Humanitas” nije potvrđen te zahtijeva provjeru prije javne objave. Brend na završnoj stranici preimenovan je u Mansalpha.'
    if ident in ['mentalno','equilibrium']:
        specific='Klinički i brojčani navodi zahtijevaju stručnu provjeru. Opisi terapije nisu individualne medicinske upute.'
    if ident=='crisis':
        specific='Kritičke teze i pojednostavljena usporedba stručnih ovlasti nisu neovisno potvrđene i ne vrijede nužno u svakom pravnom sustavu.'
    note=f'Prijepis dostavljenog PDF-a ({doc["pageCount"]} izvornih stranica). Edukativni navodi preneseni su bez neovisne provjere; izvornik nema potpunu bibliografiju. {specific}'.strip()
    content=clean(doc['content'])
    if ident=='too-much':
        content=content.replace('MEMORIJSKI ZAPIS #492','ILUSTRACIJA MEMORIJSKOG ZAPISA')
        # Avoid presenting unverified logs as authentic evidence.
        start=content.find('### Prikazani sistemski zapis')
        end=content.find('## Stranica 11',start)
        if start>=0 and end>=0:content=content[:start]+'[Ilustrativni tehnički zapisi izostavljeni su; njihova autentičnost nije potvrđena.]\n\n'+content[end:]
    image=DIGNITY if ident=='dignity' else assets.get(ident+'-cover',assets['medical-neuroscience-light_dd170033.jpg'])
    records.append(make_record(id=ident,title=doc['title'],kind='presentation',summary=doc['summary'],content=content,topics=doc['topics'],status='u izradi' if ident in ['too-much','dignity','mentalno','equilibrium','crisis','stvarnost-ai'] else 'spremno',assetUrl=assets[ident],imageUrl=image,format='PDF',sourceNote=note))

image_map={d['original']:assets.get(Path(d['path']).name,'') for d in json.load(open(ROOT/'imports/asset-downloads.json')) if d['path'].endswith('.jpg')}
for source in website['records']:
    ident=source['id'];kind=source['kind'];st=source['status'];content=clean(source.get('content',''));tags=source.get('topics',[])
    topictext=' '.join(tags).lower()
    themes=[]
    if any(x in topictext for x in ['ai','umjetn','automat']):themes.append('Umjetna inteligencija')
    if any(x in topictext for x in ['mental','neuro','anksioz','stres','liječen','ovisnost','oporavak','zdravlj']):themes.append('Mentalno zdravlje')
    if any(x in topictext for x in ['psih','percepc','kontrol','emoc','samo','ponaš','svijest']):themes.append('Psihologija')
    if any(x in topictext for x in ['filoz','svijest','parapsih','intuic']):themes.append('Filozofija')
    if any(x in topictext for x in ['sigurn','forenz','privat','prevenc']):themes.append('Sigurnost')
    if not themes:themes=['Mentalno zdravlje'] if kind=='source' else ['Psihologija']
    themes=list(dict.fromkeys(themes+tags))
    # Keep original topical labels too; filter menu presents the six core disciplines.
    image=image_map.get(source.get('imageUrl',''),'')
    asset=assets.get(ident,'')
    video=''
    note='Preneseno iz dostupnih korisnikovih edukativnih materijala. Autorske i stručne tvrdnje zahtijevaju uredničku provjeru; prijenos nije neovisna znanstvena validacija.'
    status='u izradi' if kind in ['article','presentation'] else 'spremno'
    if kind=='source':
        asset=source.get('assetUrl') or source.get('url','');note='Izvor povezan u izvornom edukativnom materijalu. Katalog ili sažetak; cjeloviti vanjski dokument nije uvezen osim ako je izričito označeno.'
    if kind=='video':
        video=assets.get(ident,source.get('url',''));asset=video;image=assets['video-cover'] if ident=='consciousness-motion-loop' else assets['medical-neuroscience-light_dd170033.jpg'];note='Dostupan izvorni MP4 videozapis prenesen u pohranu Mansalpha.' if ident=='consciousness-motion-loop' else 'Vanjski javni WHO videozapis. Reprodukcija ovisi o dostupnosti i pravilima pružatelja.'
    if source.get('restricted'):
        asset='';video='';status='u izradi';note='Ograničeni forenzički materijal: očuvani su samo neoperativni metapodaci. Izvorni dokument nije uvezen ni povezan za javno preuzimanje zbog mogućih operativnih uputa.'
    if st=='inaccessible':
        status='u izradi';note='Izvorna poveznica trenutačno nije dostupna (HTTP 404). Tekst nije izmišljen niti zamijenjen drugim materijalom.'
    if st=='accessible_homepage_modal':note+=' Samostalna ruta nije bila dostupna; sačuvan je tekst dostupan na naslovnici.'
    if kind=='article' and not image:image=assets['medical-neuroscience-light_dd170033.jpg'] if 'Mentalno zdravlje' in themes else assets['medical-research-light_9e6211b8.jpg']
    if ident=='psihologija-kontrole':image=assets['medical-research-light_9e6211b8.jpg'];note+=' Brojčani navodi trebaju provjeru; oznaka uredništva preimenovana je u Mansalpha.'
    if ident=='ovisnosti-droge-lijecenje':image=assets['medical-neuroscience-light_dd170033.jpg']
    records.append(make_record(id=ident,title=clean(source['title']),kind=kind,summary=source.get('summary',''),content=content,topics=themes,status=status,assetUrl=asset,imageUrl=image,videoUrl=video,format=source.get('format') or ('Video' if kind=='video' else 'Tekst' if kind=='article' else 'Poveznica'),sourceNote=note))

records+= [make_record(id='idea-ai-kreativnost',title='Kreativnost uz AI: alat, a ne zamjena za autora',kind='idea',summary='Prijedlog teme za budući članak ili raspravu o autorstvu, procesu i granicama automatizacije.',content='## Radni prijedlog\n\n- Kako AI može pomoći u razradi ideje?\n- Gdje ostaje ljudska odluka?\n- Kako jasno označiti AI-potpomognuti rad?\n\nDodati primjere i provjerene izvore prije objave.',topics=['Kreativnost','Umjetna inteligencija','Filozofija'],status='ideja',sourceNote='Nova urednička ideja, ne već objavljen materijal.'),make_record(id='idea-sigurni-razgovori',title='Sigurni razgovori o mentalnom zdravlju',kind='idea',summary='Prijedlog smjernica za edukativnu raspravu bez privatnih narativa, dijagnoza i pritiska na sudionike.',content='## Radni prijedlog\n\nRazraditi način vođenja rasprave u kojem sudionici nisu obvezni dijeliti osobna iskustva. Jasno odvojiti edukaciju od individualne zdravstvene procjene.',topics=['Mentalno zdravlje','Sigurnost','Psihologija'],status='ideja',sourceNote='Predložena tema za pripremu predavanja; nije klinički protokol.'),make_record(id='first-lecture-event',title='Prvo predavanje Mansalpha',kind='event',summary='Radni plan edukativnog susreta za 20–30 sudionika. Termin, prostor i kontakti čekaju potvrdu.',content='## Priprema u tijeku\n\nOtvorite modul „Prvo predavanje” za zadatke, materijale, kontakte, promotivne objave i bilješke predavača.\n\nTermin: nije određen.\nLokacija: nije određena.\nBroj sudionika: 20–30.',topics=['Umjetna inteligencija','Mentalno zdravlje','Sigurnost'],status='u izradi',sourceNote='Planirani događaj iz korisnikova zahtjeva; nije potvrđena najava.')]

templates=[
 {'id':'tpl-article','title':'Edukativni članak','type':'article','content':'# [Naslov članka]\n\n## Zašto je tema važna?\n[Uvod bez pretpostavki i senzacionalizma.]\n\n## Što znamo?\n[Provjerene činjenice uz izvor.]\n\n## Što ostaje otvoreno?\n[Granice dokaza i hipoteze.]\n\n## Ljudska perspektiva\n[Primjer bez osobnih podataka.]\n\n## Zaključak\n[Ključna poruka.]\n\n## Izvori\n[Autor / ustanova, naslov, poveznica — samo provjereni podaci.]\n\nEdukativni materijal, ne individualni zdravstveni savjet.'},
 {'id':'tpl-presentation','title':'Struktura predavanja','type':'presentation','content':'# [Naslov prezentacije]\n\n## 1. Uvod i dogovor o sigurnoj raspravi\n[Cilj, publika i granice edukacije.]\n\n## 2. Ključno pitanje\n[Pitanje za razmišljanje.]\n\n## 3. Pojmovi i provjereni nalazi\n[Definicije i izvori.]\n\n## 4. Praktičan primjer\n[Bez privatnih narativa.]\n\n## 5. Kritička rasprava\n[Što znamo, a što pretpostavljamo?]\n\n## 6. Zaključak i izvori\n[Sažetak, preporučeno čitanje i otvorena pitanja.]'},
 {'id':'tpl-post','title':'Najava edukativnog susreta','type':'post','content':'Mansalpha — znanje s ljudskom perspektivom.\n\nPripremamo edukativni susret o [provjerena tema] za 20–30 sudionika.\n\nTermin: [dodati tek nakon potvrde]\nLokacija: [dodati tek nakon potvrde]\nPrijave: [dodati potvrđeni kanal prijave]\n\nRazgovaramo o tehnologiji i čovjeku uz poštovanje privatnosti i granica stručnog znanja. Edukativni susret nije klinička procjena.'},
 {'id':'tpl-email','title':'Poziv na suradnju','type':'email','content':'Predmet: Mansalpha — prijedlog edukativne suradnje\n\nPoštovani [ime ili ustanova],\n\nPripremamo edukativni susret u okviru Mansalpha za 20–30 sudionika, na temu [tema].\n\nŽeljeli bismo razgovarati o [konkretan prijedlog suradnje].\n\nTermin i prostor definirat ćemo nakon dogovora. Molimo javite postoji li interes i koji je odgovarajući kontakt za nastavak razgovora.\n\nSrdačno,\n[provjereni podaci pošiljatelja]'},
]
lecture={
 'title':'Umjetna inteligencija i čovjek: razumijevanje, granice i odgovornost',
 'audience':'20–30 sudionika','date':'','location':'',
 'tasks':[{'id':f'task-{i+1}','text':text,'done':False} for i,text in enumerate(['Definirati cilj i ključne poruke predavanja','Potvrditi prostor i termin','Odabrati materijale i provjeriti izvore','Pripremiti strukturu i bilješke predavača','Dogovoriti kontakte i način prijava','Urediti promotivne objave i e-mail poziv','Provjeriti projektor, zvuk i reprodukciju videozapisa','Pripremiti pitanja za sigurnu raspravu'])],
 'materialIds':['osvijetljeni','too-much','dignity','mentalno','consciousness-motion-loop'],'contacts':[],
 'promotions':[{'id':'promo-post','channel':'Društvene mreže','text':templates[2]['content'],'status':'ideja'},{'id':'promo-email','channel':'E-mail poziv','text':templates[3]['content'],'status':'ideja'}],
 'notes':'# Radni prijedlog bilješki\n\n## Uvod\nPredstaviti cilj edukativnog susreta i naglasiti da sudionici ne trebaju dijeliti privatna iskustva.\n\n## Ključne poruke\nRazlikovati mogućnosti AI-ja, autorske teze i provjerene činjenice. AI nije zamjena za kvalificiranog stručnjaka. Zaštita podataka dio je odgovornog korištenja.\n\n## Rasprava\nKoje zadatke želimo prepustiti tehnologiji, a koje zadržati pod ljudskim nadzorom?\n\n## Prije predavanja\nProvjeriti stručne tvrdnje i izvore u odabranim materijalima; ukloniti privatne narative.\n\n## Završetak\nSažeti granice edukacije i ponuditi provjerene izvore za daljnje čitanje.',
 'agenda':[{'id':'agenda-1','title':'Uvod i siguran okvir','duration':'5 min'},{'id':'agenda-2','title':'AI: mogućnosti i ograničenja','duration':'15 min'},{'id':'agenda-3','title':'Mentalno zdravlje i ljudsko dostojanstvo','duration':'15 min'},{'id':'agenda-4','title':'Primjeri i kritička rasprava','duration':'15 min'},{'id':'agenda-5','title':'Pitanja i završne poruke','duration':'10 min'}]
}
workspace={'records':records,'templates':templates,'lecture':lecture}
seed='import type { Workspace } from "../shared/mansalpha";\n\n// Sourced migration data; private narratives omitted. Defaults never overwrite saved user edits.\nexport const seedWorkspace: Workspace = '+json.dumps(workspace,ensure_ascii=False,indent=2)+';\n'
(ROOT/'server/seed.ts').write_text(seed)
(ROOT/'imports/final-workspace.json').write_text(json.dumps(workspace,ensure_ascii=False,indent=2)+'\n')
print(f'Created {len(records)} records, {len(templates)} templates, {len(lecture["tasks"])} lecture tasks.')
