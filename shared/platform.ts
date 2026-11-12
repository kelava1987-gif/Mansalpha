import { HOMEPAGE_IMAGES } from "./homepage";

/** Only the biography and photo explicitly supplied for this profile are authorized. */
export const AUTHOR_PROFILE = {
  name: "Luka Anić-Antić",
  role: "Autor · interdisciplinarni istraživački pristup",
  imageUrl: "/manus-storage/mansalpha-author_3811c140.webp",
  biography:
    "Luka Anić-Antić djeluje na raskrižju kriminalistike, forenzičke psihologije i psihofarmakologije. Po formalnom obrazovanju ekonomist, profesionalno iskustvo gradio je u područjima koja zahtijevaju razumijevanje ljudskog ponašanja u kriznim situacijama.",
  background:
    "Više godina radio je u MUP-u RH kao kriminalist, položio državni stručni ispit i stekao praktično iskustvo u radu s osobama u kriznim stanjima.",
  focus:
    "Bihevioralna analiza, ovisnosti, psihotropne tvari, psihofarmakologija i toksikologija — s ciljem razumijevanja, a ne osuđivanja.",
  sourceNote: "Biografski opis i fotografiju autor je dostavio za ovu sekciju.",
} as const;

export const MANSALPHA_MISSION =
  "Glavni cilj MansAlpha inicijative jest autentično i dubinsko razumijevanje ljudske psihe kroz otvoreno istraživanje nekonvencionalnih uvida. Metodološka rigoroznost susreće se s parapsihološkom znatiželjom — uz jasno razlikovanje dokaza, interpretacija i otvorenih pitanja.";
export const MANSALPHA_METHOD =
  "Multidisciplinarni okvir povezuje znanstveno utemeljeno znanje s otvorenošću prema još neobjašnjenim iskustvima. Otvorenost ne zamjenjuje provjeru: hipoteze traže kontrolirane uvjete, ponovljivost i kritičko čitanje rezultata.";
export const MANSALPHA_MOTTO = "Bez straha od istine.";
export const HERMETIC_PRINCIPLE =
  "Ono što je iznad, jest kao i ono što je dolje.";

export const RESEARCH_FRAMEWORK = [
  {
    id: "clinical",
    number: "01",
    title: "Klinička psihologija",
    subtitle: "Dokazi i razumijevanje ponašanja",
    description:
      "Edukativno istraživanje znanstveno utemeljene analize ponašanja, kognitivnih procesa i podsvjesnih mehanizama obrane. Na dokazima utemeljeni pristupi promatraju se u kontekstu stručne literature.",
    detail:
      "Psihodinamska i psihoanalitička čitanja moći — uključujući Freudove interpretacije potisnutih nagona i narcističkog proširenja ega — služe kao teorijski okviri. Ne predstavljaju dijagnozu konkretne osobe. Opis područja nije tvrdnja da platforma pruža terapiju ili dijagnostiku niti da autor ima kliničko zvanje.",
    note: "Edukativni okvir, ne klinička usluga.",
    path: "/knjiznica?tema=Psihologija",
    linkLabel: "Čitaj o psihologiji",
  },
  {
    id: "parapsychology",
    number: "02",
    title: "Parapsihologija",
    subtitle: "Otvorena pitanja, kritički pristup",
    description:
      "Proučavanje izvanosjetilne percepcije (ESP), jasnovidnosti, telepatije i psihokineze kroz raspravu o eksperimentalnim protokolima, kontrolama i granicama dokaza.",
    detail:
      "Kvantna zapletenost umova i makroskopsko kvantno tuneliranje, povezivano s pojmom „makro poltergeist”, dio su dostavljenog autorskog konceptualnog okvira. To su spekulativni prijedlozi, a ne potvrđeni mehanizmi. Fizikalni pojam kvantne zapletenosti sam po sebi nije dokaz telepatije ili paranormalnog utjecaja.",
    note: "Kontroverzno područje; hipoteze nisu dokazi.",
    path: "/clanci?tema=Filozofija",
    linkLabel: "Istraži rubna pitanja",
  },
  {
    id: "mind",
    number: "03",
    title: "Filozofija uma",
    subtitle: "Svijest, iskustvo i slobodna volja",
    description:
      "Temeljna pitanja o subjektivnom iskustvu, kvalijama, slobodnoj volji i odnosu uma i tijela. Filozofijska refleksija produbljuje način na koji postavljamo psihološka pitanja.",
    detail:
      "Kvalije označavaju subjektivne kvalitete iskustva. Orch-OR jedna je od teorijskih hipoteza o svijesti koja uključuje kvantne procese; nije znanstveni konsenzus niti potvrda da je svijest kvantno svojstvo svemira. U platformi se koristi kao predmet kritičke rasprave.",
    note: "Različite teorije, bez unaprijed zadanog zaključka.",
    path: "/knjiznica?tema=Filozofija",
    linkLabel: "Istraži filozofiju uma",
  },
  {
    id: "forensic",
    number: "04",
    title: "Forenzička praksa",
    subtitle: "Metodološka preciznost i kontekst",
    description:
      "Edukativni pogled na primjenu psihološkog znanja u pravnom kontekstu: vjerodostojnost, bihevioralni obrasci i profiliranje, uz pozornost na metode i granice njihove valjanosti.",
    detail:
      "Analiza ponašanja ne daje siguran uvid u nečije namjere. Vjerodostojnost i zaključci traže više neovisnih izvora dokaza, jasnu metodologiju i odgovarajući pravni okvir. Sadržaj nije stručna procjena konkretnog slučaja i ne sadrži operativne upute.",
    note: "Dokazi prije zaključka; bez osude i senzacionalizma.",
    path: "/knjiznica?tema=Sigurnost",
    linkLabel: "Istraži sigurnost i forenziku",
  },
] as const;

export const AUTHOR_ASSERTIONS = {
  text: "Dostavljeni autorski opis inicijative navodi više od 15 godina iskustva, rad s preko 500 klijenata i brojne objavljene radove.",
  note: "To su autorski navodi, ne neovisno potvrđene statistike. Dokumentacija i popis radova za provjeru nisu priloženi. Ti navodi ne potvrđuju kliničku kvalifikaciju niti se koriste kao jamstvo usluge ili ishoda.",
} as const;

export const PLATFORM_PAGE_VISUALS: Record<
  string,
  { image: string; label: string; number: string }
> = {
  "/pregled": {
    image: HOMEPAGE_IMAGES.hero,
    label: "VAŠ PROSTOR ZNANJA",
    number: "01",
  },
  "/knjiznica": {
    image: HOMEPAGE_IMAGES.science,
    label: "DIGITALNA KNJIŽNICA",
    number: "02",
  },
  "/clanci": {
    image: HOMEPAGE_IMAGES.philosophy,
    label: "IDEJE VRIJEDNE ČITANJA",
    number: "03",
  },
  "/prezentacije": {
    image: HOMEPAGE_IMAGES.ai,
    label: "ZNANJE U JASNOJ STRUKTURI",
    number: "04",
  },
  "/videozapisi": {
    image: HOMEPAGE_IMAGES.perception,
    label: "PERSPEKTIVE U POKRETU",
    number: "05",
  },
  "/izvori": {
    image: HOMEPAGE_IMAGES.science,
    label: "DOKAZI PRIJE ZAKLJUČKA",
    number: "06",
  },
  "/dogadaji": {
    image: HOMEPAGE_IMAGES.hero,
    label: "ZNANJE KOJE POVEZUJE",
    number: "07",
  },
  "/ideje": {
    image: HOMEPAGE_IMAGES.creativity,
    label: "OD PITANJA DO MOGUĆNOSTI",
    number: "08",
  },
  "/predavanje": {
    image: HOMEPAGE_IMAGES.philosophy,
    label: "RAZGOVOR KOJI OTVARA HORIZONT",
    number: "09",
  },
  "/predlosci": {
    image: HOMEPAGE_IMAGES.creativity,
    label: "POLAZIŠTE ZA NOVI SADRŽAJ",
    number: "10",
  },
  "/postavke": {
    image: HOMEPAGE_IMAGES.security,
    label: "ODGOVORNOST I POVJERENJE",
    number: "11",
  },
};
