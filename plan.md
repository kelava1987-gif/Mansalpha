# MansAlpha — redizajn naslovnice

## Potvrđeni smjer

Korisnik je dostavio vizualnu referencu i detaljne upute za potpunu redakcijsku doradu naslovnice. Način: Redesign · Overhaul samo javno orijentirane naslovnice, uz očuvanje postojećih uredničkih funkcija. Prethodna naslovnica je svijetla osobna nadzorna ploča; novi ulaz je tamni premium edukativni portal. Nadzorna ploča ostaje na /pregled, postojeće knjižnične i uredničke rute ostaju nepromijenjene. Ne objavljivati ili deployati bez izričitog odobrenja.

## Dizajn

Dizajnerski pokret: kinematografski znanstveni magazin, klasična humanistička tipografija u preciznom digitalnom okviru. Referenca je dostavljen MansAlpha vizual: tamnoplava, kamen, neuralni uzorci, zlatni horizont. Dials: vizualna varijacija 7, pokret 3, gustoća 6, ovisnost o vizualima 9, vjernost brendu 10.

Temelj je midnight navy #050d19 i #0b1728, bjelina #edf4ff, električno-plavi #67c7f0 s umjerenom ljubičastom i champagne #d6bc88. Veliki naslov MANSALPHA u profinjenom serifnom Cormorant Garamond; Manrope za uredničke naslove i sučelje. Razmaci u ritmu 8 px, prostrane sekcije, tanke rubne linije, mali radijusi, minimalni glassmorphism. Pokreti 200–650 ms, hover pomak do 4 px, ulazno otkrivanje sekcija bez skrivanja sadržaja ako JS zakaže, obvezan reduced-motion. Svaki vidljivi link funkcionira i svaki mobilni cilj ima najmanje 44 px.

Narativ: jedan impresivan naslovni kadar, precizan uvod, šest slikovnih tematskih ulaza, asimetrično izdvojeni postojeći članci, split-screen svijest/AI, digitalna knjižnica i tri tražena YouTube reproduktora nakon sigurnosne provjere, manifest i vizija planiranih aktivnosti. Bez ponavljanja slova ugrađenih u sliku: koristi se novi kadar vođen dostavljenim uzorkom bez natpisa i stvarni HTML naslov. Izvorna referenca ne mijenja se.

## Struktura i integracije

- client/src/pages/Home.tsx ostaje kontroler navigacije, stvarne prijave, spremanja i dijaloga. Za / prikazuje novu PremiumHomepage, za /pregled i postojeće module koristi postojeće komponente.
- client/src/components/homepage sadrži naslovnicu, navigaciju i sadržajne sekcije; homepage.css je potpuno odvojen i prefiksiran, ne mijenja svijetle uredničke alate.
- shared/homepage.ts definira sigurne uredničke odabire, vizualne URL-ove, šest tema i opis platforme. server/routers.ts dodaje read-only editorial endpoint s isključivo neosobnim početnim edukativnim zapisima. Osobni radni prostor, kontakti i nacrti nikad nisu izvor naslovnice.
- Postojeći seed, baze, PDF-ovi, prezentacije, videozapisi i spremanje ostaju očuvani. Nove slike u trajnoj pohrani i optimizirane datoteke. Ugrađeni YouTube no-cookie reproduktori bez autoplay, učitani tek na korisnikov klik.
- SEO strukturirani hrvatski naslov, opis, metadata, semantičke sekcije i crawlable edukativni pregled; nema izmišljenih datuma, autora, stručnih zvanja ni referenci. Bez tvrdnji o partnerstvu s drugim institucijama.

## Privatnost i granice

Privatni narativi, biografije, osjetljivi podaci i povjerljive datoteke nisu uključeni u naslovnicu, vizuale, spremište koda ili javno dostupne resurse. Radni imports ostaje zaštićen HTTP blokadom i .gitignore. Tri korisnikova videa prije prikaza pregledati; ako sadržaj nije moguće provjeriti ili sadrži zabranjeni privatni kontekst, ne učitati reproduktor i jasno označiti ograničenje. Planirani događaji i radionice nisu prikazani kao potvrđeni. Prikaz se isporučuje isključivo u Previewu.

## Proširenje — cijela platforma i autorski profil

Korisnik potvrđuje primjenu postojećeg premium kinematografskog identiteta na sve stranice: pregled, knjižnica, članci, prezentacije, videozapisi, izvori, događaji, ideje, predavanje, predlošci i postavke. Način Redesign · Preserve za funkcije, Overhaul za stari medicinski/sage izgled. Usvojeni dizajn naslovnice je referenca; nema novog biranja stila. Midnight navy, cyan i champagne; Manrope u sučelju, Cormorant Garamond za hero i uređivačke naslove. Čitljivost, navigacija, preglednost formi i svi postojeći podaci su zaštićeni ugovori.

Raspored: isti glavni header s navigacijom projekta kroz sve stranice, tamni urednički sidebar kao radni indeks, slikovni page-heading s tematskom fotografijom/ilustracijom i oznakom formata, zatim funkcionalni paneli. Sve forme, statusi, pretraga, filtre, eksport, bazu i prijavu zadržati. Dijaloge uskladiti istim tokenima i osigurati jasan fokus. Nema promjene API-ja niti testnih upisa u bazu. Dinamički progress koristi iste brand-varijable. Dials ostaju 7/3/6/9/10; radni moduli koriste manje dekoracije i veću gustoću radi upotrebljivosti.

Novi shared/platform.ts: isključivo odobrena biografija autora, URL dostavljene fotografije bez metapodataka, cilj i četiri istraživačka područja iz novog opisa; koncepti označeni epistemološki. client/src/components/homepage/MansalphaIdentity.tsx: pregledan istraživački okvir i autor u naslovnici. Opći edukativni tekstovi izvornog projekta pod novim identitetom; ne uvoziti osobne dokumente, privatne priče, kontakte, nove datume ili osjetljive činjenice.

Narrow privacy authorization: samo fotografija IMG_0492.JPG i biografija koju je korisnik izričito dostavio za sekciju autora dopuštene su u novom prikazu. Zabrana svih ostalih privatnih podataka, dokumenata i narativa ostaje. Brojke 15 godina / 500 klijenata i objavljeni radovi jesu autorski navodi, ne potvrđene činjenice; držati uz vidljivo upozorenje i ne koristiti kao verificirane marketinške statistike. Klinička psihologija prikazuje se edukativno, bez tvrdnje da autor ima kliničko zvanje ili pruža terapiju/dijagnostiku. Kvantni i parapsihološki primjeri su hipoteze; znanstvena validacija ne smije biti pretpostavljena.

Čuvanje: nadogradnja u Preview i checkpoint, bez nove objave. Trenutno objavljena verzija 86e1846 ostaje privatna samo vlasniku; auto_publish=false. Ponovna objava zahtijeva novu izričitu korisnikovu uputu.
