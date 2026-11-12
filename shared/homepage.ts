import type { ContentRecord } from "./mansalpha";

export const HOMEPAGE_TITLE =
  "MansAlpha — inteligencija, svijest i nova perspektiva";
export const HOMEPAGE_DESCRIPTION =
  "MansAlpha povezuje psihologiju, mentalno zdravlje, umjetnu inteligenciju, filozofiju i kreativnost. Istražite članke, prezentacije i edukativne videozapise.";
export const MANIFESTO =
  "Znanje nema punu vrijednost ako ne pridonosi razumijevanju. Razumijevanje nema punu vrijednost ako ne potiče odgovorno djelovanje.";
export const HOMEPAGE_IMAGES = {
  hero: "/manus-storage/async-images/1SgFz5s08WO8C3zNNkDfBb/image-1.webp",
  ai: "/manus-storage/async-images/1SgFz5s08WO8C3zNNkDfBb/image-2.webp",
  philosophy: "/manus-storage/async-images/1SgFz5s08WO8C3zNNkDfBb/image-3.webp",
  creativity: "/manus-storage/async-images/1SgFz5s08WO8C3zNNkDfBb/image-4.webp",
  security: "/manus-storage/async-images/1SgFz5s08WO8C3zNNkDfBb/image-5.webp",
  psychology:
    "/manus-storage/medical-neuroscience-light_dd170033_fd82b383.webp",
  science: "/manus-storage/medical-research-light_9e6211b8_d18f967d.webp",
  perception: "/manus-storage/percepcija-cover_1bbb55fe.webp",
};
export const KNOWLEDGE_AREAS = [
  {
    id: "psychology",
    title: "Psihologija i mentalno zdravlje",
    label: "UM I PONAŠANJE",
    description:
      "Razumijevanje misli, emocija i ponašanja. Edukacija koja čovjeka stavlja u središte.",
    image: HOMEPAGE_IMAGES.psychology,
    topic: "Psihologija",
    path: "/knjiznica?tema=Psihologija",
  },
  {
    id: "ai",
    title: "Umjetna inteligencija i tehnologija",
    label: "NOVA INTELIGENCIJA",
    description:
      "Mogućnosti algoritama, granice automatizacije i odgovoran odnos prema tehnologiji.",
    image: HOMEPAGE_IMAGES.ai,
    topic: "Umjetna inteligencija",
    path: "/knjiznica?tema=Umjetna%20inteligencija",
  },
  {
    id: "philosophy",
    title: "Filozofija i svijest",
    label: "DUBLJA PITANJA",
    description:
      "Što znači razumjeti, misliti i biti čovjek? Prostor za kritičko promišljanje i otvorena pitanja.",
    image: HOMEPAGE_IMAGES.philosophy,
    topic: "Filozofija",
    path: "/knjiznica?tema=Filozofija",
  },
  {
    id: "creativity",
    title: "Kreativnost i inovacije",
    label: "PROSTOR MOGUĆNOSTI",
    description:
      "Ideje na presjeku znanja, mašte i tehnologije. Ljudsko autorstvo ostaje polazište.",
    image: HOMEPAGE_IMAGES.creativity,
    topic: "Kreativnost",
    path: "/knjiznica?tema=Kreativnost",
  },
  {
    id: "security",
    title: "Sigurnost i forenzička analiza",
    label: "ODGOVORNOST I ZAŠTITA",
    description:
      "Privatnost, digitalna sigurnost i kritička analiza dokaza — bez zadiranja u osobne granice.",
    image: HOMEPAGE_IMAGES.security,
    topic: "Sigurnost",
    path: "/knjiznica?tema=Sigurnost",
  },
  {
    id: "science",
    title: "Znanost, istraživanje i obrazovanje",
    label: "TEMELJI ZNANJA",
    description:
      "Izvori, edukativni materijali i pitanja koja povezuju različita područja istraživanja.",
    image: HOMEPAGE_IMAGES.science,
    topic: "",
    path: "/izvori",
  },
] as const;
export interface HomepageVideo {
  id: string;
  imageUrl?: string;
  title: string;
  description: string;
  url: string;
  checkedContent: boolean;
  isSafe: boolean;
  embeddable: boolean | null;
  note: string;
}
// Only inspected educational videos. No personal data or unverified case narratives.
export const HOMEPAGE_VIDEOS: HomepageVideo[] = [
  {
    id: "dO7PDVKocao",
    imageUrl: HOMEPAGE_IMAGES.philosophy,
    title: "Lacan protiv Derridaa",
    description:
      "Osvrt na filozofski i psihoanalitički spor Lacana i Derridaa o Freudovu konceptu prisile ponavljanja.",
    url: "https://youtu.be/dO7PDVKocao",
    checkedContent: true,
    isSafe: true,
    embeddable: true,
    note: "Audiovizualno pregledano bez otkrivenog privatnog konteksta. Reprodukcija ovisi o pravilima YouTubea.",
  },
  {
    id: "CC-OIkBJlMs",
    imageUrl: HOMEPAGE_IMAGES.psychology,
    title: "Uvod u psihologiju",
    description:
      "Edukativni uvod u psihologiju kroz njezinu definiciju, povijesni razvoj, glavne grane i praktičnu primjenu.",
    url: "https://youtu.be/CC-OIkBJlMs",
    checkedContent: true,
    isSafe: true,
    embeddable: true,
    note: "Audiovizualno pregledano bez otkrivenog privatnog konteksta. Reprodukcija ovisi o pravilima YouTubea.",
  },
  {
    id: "rNh6fM6_hCo",
    imageUrl: HOMEPAGE_IMAGES.science,
    title: "MansAlpha — filozofski okvir svijesti",
    description:
      "Autorski teorijski pogled na svijest koji povezuje ideje iz fizike i biologije. Prikaz teme nije potvrda njegovih znanstvenih tvrdnji.",
    url: "https://youtu.be/rNh6fM6_hCo",
    checkedContent: true,
    isSafe: true,
    embeddable: true,
    note: "Audiovizualno pregledano bez otkrivenog privatnog konteksta. Reprodukcija ovisi o pravilima YouTubea.",
  },
];

const COVER_BY_ID: Record<string, string> = {
  "neuropsihijatrija-vodic-mozak-psihijatrija": HOMEPAGE_IMAGES.psychology,
  "iluzija-linearne-percepcije": HOMEPAGE_IMAGES.perception,
  "forenzika-ponasanja-nesvjesni-obrasci": HOMEPAGE_IMAGES.security,
  "filozofija-uma-rubni-fenomeni": HOMEPAGE_IMAGES.philosophy,
};
const ARTICLE_PRIORITY = Object.keys(COVER_BY_ID);
export function featuredArticles(records: ContentRecord[]) {
  return records
    .filter(
      r =>
        r.kind === "article" &&
        r.content.trim() &&
        r.id !== "platform-educational-overview"
    )
    .sort((a, b) => {
      const i = ARTICLE_PRIORITY.indexOf(a.id);
      const j = ARTICLE_PRIORITY.indexOf(b.id);
      return (i < 0 ? 999 : i) - (j < 0 ? 999 : j);
    })
    .slice(0, 4)
    .map(r => ({ ...r, imageUrl: COVER_BY_ID[r.id] || r.imageUrl }));
}
export function topicHref(topic: string) {
  return `/knjiznica?tema=${encodeURIComponent(topic)}`;
}
