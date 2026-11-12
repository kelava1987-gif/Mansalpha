from pathlib import Path
import json,re,subprocess
import pymupdf as fitz
ROOT=Path('/home/ubuntu/mansalpha')
# Keep only general explanatory source pages. No case narrative, dates, identifiers or logs.
doc=fitz.open('/home/ubuntu/upload/WhenAIKnowsTooMuch(1).pdf')
doc.select([1,4,6,7,8,11])
doc.set_metadata({'title':'Mansalpha — granice AI memorije','subject':'Opći edukativni izbor bez privatnog konteksta'})
path=ROOT/'imports/prepared/mansalpha-ai-memorija-edukativno.pdf'
doc.save(path,garbage=4,deflate=True)
doc.close()
proc=subprocess.run(['manus-upload-file','--webdev',str(path)],capture_output=True,text=True,timeout=180)
if proc.returncode: raise RuntimeError(proc.stdout+proc.stderr)
url=re.search(r'Storage Path:\s*(/manus-storage/\S+)',proc.stdout).group(1)
assets=json.load(open(ROOT/'imports/asset-storage.json'));assets['too-much']=url
(ROOT/'imports/asset-storage.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
docdata=json.load(open(ROOT/'imports/too-much.json'))
docdata['content']='''# Kada umjetna inteligencija zna previše

## Edukativni izbor bez privatnog konteksta

Ovaj prikaz sadrži isključivo opća objašnjenja. Osobne okolnosti, opisi pojedinačnog slučaja, datumi, identifikatori i tehnički zapisi nisu uključeni.

## Granice memorije i personalizacije

Korisno pamćenje odnosi se na izričito zadane postavke i zadatke. Psihološko profiliranje znači izvođenje zaključaka o osobnosti koje korisnik nije izričito zatražio. Uvjerljivost teksta nije dokaz njegove istinitosti.

Velika količina zapamćenih informacija nije isto što i ispravno razumijevanje osobe. Poseban je rizik pripisivanje informacija pogrešnoj osobi na dijeljenom računu.

## AI nije stručna psihološka procjena

Digitalni sustav može proizvoditi tekst koji djeluje empatično. Takav dojam nije dokaz svijesti, razumijevanja ili stručne sposobnosti. Psihološka procjena zahtijeva odgovarajuće obrazovanje, provjerene postupke i kontekst.

Osoba se mijenja. Fiksna pretpostavka sustava ne treba postati trajna etiketa.

## Povratna petlja pristranosti

Izvornik opisuje rizik prekomjernog potvrđivanja korisnika (sycophancy). Ranija pretpostavka, ako se trajno pamti i koristi pri budućim odgovorima, može ograničiti razmatranje drugih objašnjenja. Bibliografski izvori nisu navedeni i tvrdnje treba provjeriti prije javne stručne uporabe.

## Privatnost i osjećaj kontrole

Digitalno povjerenje uključuje razumljiv odgovor na pitanja: što se sprema, u koju svrhu, koliko dugo i kako korisnik može upravljati tim informacijama. Posebne kategorije osobnih podataka ne treba unositi bez jasne potrebe i razumijevanja načina obrade.

## Ljudski nadzor i dostojanstvo

Odgovorno korištenje podrazumijeva transparentnost, ograničavanje osjetljivih podataka i ljudski nadzor. Pojedinac treba imati prostor za promjenu mišljenja i razvoj, bez definiranja cijelog identiteta jednim razgovorom.

Povjerenje nije dozvola za neograničeno pamćenje.
'''
docdata['summary']='Opći edukativni prikaz granica memorije AI-ja, psihološkog profiliranja, pristranosti i digitalnog povjerenja. Prikaz ne sadrži privatni kontekst, osobne podatke ni narativ pojedinačnog slučaja.'
(ROOT/'imports/too-much.json').write_text(json.dumps(docdata,ensure_ascii=False,indent=2)+'\n')
script=ROOT/'scripts/create_seed.py';s=script.read_text();s=s.replace('Privatni narativi i osjetljivi zapisi izostavljeni su. PDF je urednička kopija bez izvornih stranica 6, 10 i 11; opći edukativni sadržaj tih stranica ostaje u tekstu. Autentičnost ilustriranih sistemskih zapisa nije potvrđena.','Privatni kontekst nije uključen. PDF sadrži samo šest odabranih općih edukativnih stranica, bez osobnog slučaja, datuma, identifikatora i zapisa. Tekst je urednički prilagođen istom ograničenju.');script.write_text(s)
print('Safe educational PDF uploaded:',url)
