import React, { useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Brain,
  Cpu,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  FileText,
  Presentation,
  Play,
  Link2,
  CalendarDays,
  Lightbulb,
} from "lucide-react";
import type { ContentRecord } from "../../../../shared/mansalpha";
import {
  KNOWLEDGE_AREAS,
  HOMEPAGE_IMAGES,
  HOMEPAGE_VIDEOS,
  MANIFESTO,
  featuredArticles,
} from "../../../../shared/homepage";
import HomepageNavigation, { localNavigation } from "./HomepageNavigation";
import HomepageVideo from "./HomepageVideo";
import { AuthorSection, ResearchFramework } from "./MansalphaIdentity";
import {
  MANSALPHA_MISSION,
  MANSALPHA_METHOD,
} from "../../../../shared/platform";
interface Props {
  records: ContentRecord[];
  loading?: boolean;
  error?: boolean;
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
  onOpen: (record: ContentRecord) => void;
  onRetry?: () => void;
}
const ICONS = [Brain, Cpu, BookOpen, Sparkles, ShieldCheck, FlaskConical];
const LIBRARY_LINKS = [
  {
    title: "Članci",
    description: "Analize i edukativni tekstovi",
    kind: "article",
    href: "/clanci",
    icon: FileText,
  },
  {
    title: "Prezentacije",
    description: "Ideje u jasnoj strukturi",
    kind: "presentation",
    href: "/prezentacije",
    icon: Presentation,
  },
  {
    title: "Videozapisi",
    description: "Znanje u pokretu",
    kind: "video",
    href: "/videozapisi",
    icon: Play,
  },
  {
    title: "Izvori",
    description: "Literatura i temelji znanja",
    kind: "source",
    href: "/izvori",
    icon: Link2,
  },
];
export default function PremiumHomepage({
  records,
  loading = false,
  error = false,
  onNavigate,
  onSearch,
  onOpen,
  onRetry,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !root.current ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const elements =
      root.current.querySelectorAll<HTMLElement>("[data-mh-reveal]");
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("mh-revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const articles = featuredArticles(records);
  const presentations = records
    .filter(r => r.kind === "presentation" && r.assetUrl)
    .slice(0, 3);
  const link = (event: React.MouseEvent<HTMLAnchorElement>, path: string) =>
    localNavigation(event, path, onNavigate);
  return (
    <div className="mh-page" ref={root}>
      <a className="mh-skip-link" href="#mh-main">
        Preskoči na sadržaj
      </a>
      <HomepageNavigation onNavigate={onNavigate} onSearch={onSearch} />
      <main id="mh-main">
        <section className="mh-hero" aria-labelledby="mh-hero-title">
          <img
            className="mh-hero-image"
            src={HOMEPAGE_IMAGES.hero}
            alt="Konceptualni prikaz klasične filozofije, neuralne inteligencije i čovjeka pred otvorenim horizontom"
            width="2520"
            height="1080"
            fetchPriority="high"
          />
          <div className="mh-hero-shade" />
          <div className="mh-hero-content">
            <p className="mh-hero-kicker">
              <span />
              LJUDSKI UM. OTVORENI HORIZONTI.
            </p>
            <h1 id="mh-hero-title">
              MANS<span>ALPHA</span>
            </h1>
            <p className="mh-hero-subtitle">
              Inteligencija. Svijest. Znanje. Evolucija.
            </p>
            <p className="mh-hero-statement">
              Mjesto gdje se ljudski um susreće s umjetnom inteligencijom,
              znanost s filozofijom, a znanje s kreativnošću.
            </p>
            <div className="mh-hero-actions">
              <a className="mh-button mh-button-primary" href="#podrucja">
                Istraži MansAlpha
                <ArrowDown size={17} />
              </a>
              <a
                className="mh-button mh-button-outline"
                href="/clanci"
                onClick={e => link(e, "/clanci")}
              >
                Otkrij članke
                <ArrowUpRight size={17} />
              </a>
              <a
                className="mh-hero-text-link"
                href="/prezentacije"
                onClick={e => link(e, "/prezentacije")}
              >
                Pogledaj prezentacije
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="mh-hero-bottom">
            <span>ZNANJE · RAZUMIJEVANJE · RAZVOJ ČOVJEKA</span>
            <a href="#uvod" aria-label="Nastavi istraživati naslovnicu">
              <ArrowDown size={17} />
              NASTAVI ISTRAŽIVATI
            </a>
          </div>
        </section>
        <div className="mh-discipline-strip" aria-label="Glavna područja">
          <span>PSIHOLOGIJA</span>
          <i />
          <span>UMJETNA INTELIGENCIJA</span>
          <i />
          <span>FILOZOFIJA</span>
          <i />
          <span>KREATIVNOST</span>
          <i />
          <span>SIGURNOST</span>
        </div>
        <section
          className="mh-section mh-introduction"
          id="uvod"
          data-mh-reveal
        >
          <div>
            <p className="mh-eyebrow">
              <span className="mh-section-number">01 /</span> NOVA PERSPEKTIVA
            </p>
            <h2>
              Više od znanja.
              <br />
              <em>Nova perspektiva</em>
              <br />
              razumijevanja.
            </h2>
          </div>
          <div className="mh-introduction-copy">
            <span className="mh-editorial-rule" />
            <p className="mh-lead">
              Složena pitanja ne pripadaju samo jednoj disciplini.
            </p>
            <p>{MANSALPHA_MISSION}</p>
            <p>{MANSALPHA_METHOD}</p>
            <a className="mh-inline-link" href="#manifest">
              Upoznajte našu filozofiju
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <ResearchFramework onNavigate={onNavigate} />
        <section className="mh-section mh-areas" id="podrucja" data-mh-reveal>
          <div className="mh-section-heading">
            <div>
              <p className="mh-eyebrow">
                <span className="mh-section-number">02 /</span> PODRUČJA ZNANJA
              </p>
              <h2>
                Šest perspektiva.
                <br />
                <em>Jedan širi pogled.</em>
              </h2>
            </div>
            <p>
              Različite discipline. Povezana pitanja.
              <br />
              Odaberite vlastiti smjer istraživanja.
            </p>
          </div>
          <div className="mh-areas-grid">
            {KNOWLEDGE_AREAS.map((area, index) => {
              const Icon = ICONS[index];
              return (
                <a
                  className={`mh-area-card mh-area-${area.id}`}
                  href={area.path}
                  onClick={e => link(e, area.path)}
                  key={area.id}
                >
                  <div className="mh-area-image">
                    <img
                      src={area.image}
                      alt=""
                      loading="lazy"
                      width="640"
                      height="640"
                    />
                    <span className="mh-area-number">0{index + 1}</span>
                    <span className="mh-area-icon">
                      <Icon size={23} strokeWidth={1.4} />
                    </span>
                  </div>
                  <div className="mh-area-copy">
                    <span className="mh-eyebrow">{area.label}</span>
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    <span className="mh-area-cta">
                      Istraži područje
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <p className="mh-image-note">
            Konceptualne znanstvene i umjetničke ilustracije — nisu medicinski
            nalazi niti osobni podaci.
          </p>
        </section>
        <section className="mh-research-wrap" id="istrazivanja">
          <div className="mh-section mh-research" data-mh-reveal>
            <div className="mh-section-heading">
              <div>
                <p className="mh-eyebrow">
                  <span className="mh-section-number">03 /</span> UREDNIČKI
                  ODABIR
                </p>
                <h2>
                  Istraživanja, analize
                  <br />
                  <em>i perspektive.</em>
                </h2>
              </div>
              <a
                className="mh-inline-link"
                href="/clanci"
                onClick={e => link(e, "/clanci")}
              >
                Svi članci
                <ArrowUpRight size={18} />
              </a>
            </div>
            {loading ? (
              <div className="mh-state" role="status">
                Učitavamo postojeće članke…
              </div>
            ) : error ? (
              <div className="mh-state">
                <p>Članci se trenutačno ne mogu učitati.</p>
                <button
                  className="mh-button mh-button-outline"
                  onClick={onRetry}
                >
                  Pokušaj ponovno
                </button>
              </div>
            ) : articles.length ? (
              <div className="mh-article-grid">
                {articles.map((record, index) => (
                  <article
                    className={`mh-article-card ${index === 0 ? "mh-article-lead" : ""}`}
                    key={record.id}
                  >
                    <a
                      className="mh-article-open"
                      href={`/clanci?citaj=${encodeURIComponent(record.id)}`}
                      onClick={event => {
                        if (
                          event.button === 0 &&
                          !event.metaKey &&
                          !event.ctrlKey &&
                          !event.shiftKey &&
                          !event.altKey
                        ) {
                          event.preventDefault();
                          onOpen(record);
                        }
                      }}
                      aria-label={`Čitaj: ${record.title}`}
                    >
                      <div className="mh-article-image">
                        <img
                          src={record.imageUrl}
                          alt=""
                          width="900"
                          height="640"
                          loading="lazy"
                        />
                        <span className="mh-article-image-label">
                          {index === 0
                            ? "IZDVOJENA PERSPEKTIVA"
                            : "MANSALPHA / ČLANAK"}
                        </span>
                      </div>
                      <div className="mh-article-copy">
                        <span className="mh-eyebrow">
                          {record.topics[0] || "Edukacija"}
                        </span>
                        <h3>{record.title}</h3>
                        <p>{record.summary}</p>
                        <span className="mh-article-cta">
                          Pročitaj članak
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mh-state">
                U ovoj cjelini trenutačno nema dostupnih članaka.
              </div>
            )}
            <div className="mh-editorial-note">
              <ShieldCheck size={17} />
              <p>
                Autorske perspektive i edukativni materijali. Stručne tvrdnje i
                izvori označeni su uredničkim napomenama; sadržaj nije
                individualni zdravstveni savjet.
              </p>
            </div>
          </div>
        </section>
        <section className="mh-section mh-consciousness" data-mh-reveal>
          <div className="mh-consciousness-visual">
            <img
              src={HOMEPAGE_IMAGES.psychology}
              alt="Konceptualna znanstvena vizualizacija mozga i neuronskih veza"
              width="900"
              height="800"
              loading="lazy"
            />
            <span className="mh-visual-corner">HUMAN × ARTIFICIAL</span>
            <span className="mh-visual-caption">
              DVIJE PERSPEKTIVE. OTVORENA PITANJA.
            </span>
          </div>
          <div className="mh-consciousness-copy">
            <p className="mh-eyebrow">
              <span className="mh-section-number">04 /</span> NA PRESJEKU
              DISCIPLINA
            </p>
            <h2>
              Kada ljudska svijest
              <br />
              susretne{" "}
              <em>
                umjetnu
                <br />
                inteligenciju.
              </em>
            </h2>
            <p>
              Što tehnologija može modelirati — a što ostaje ljudsko iskustvo?
              MansAlpha istražuje dodirne točke kognicije, algoritama, etike i
              kreativnosti, bez poistovjećivanja inteligentnog odgovora sa
              sviješću.
            </p>
            <p>
              Ne tražimo jednostavne odgovore na složena pitanja. Gradimo
              prostor za kritičko promišljanje mogućnosti, ograničenja i
              odgovornosti.
            </p>
            <div className="mh-concept-tags">
              <span>Kognicija</span>
              <span>Etika</span>
              <span>Kreativnost</span>
              <span>Ljudski nadzor</span>
            </div>
            <a
              className="mh-inline-link"
              href="/knjiznica?tema=Umjetna%20inteligencija"
              onClick={e => link(e, "/knjiznica?tema=Umjetna%20inteligencija")}
            >
              Istraži umjetnu inteligenciju
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="mh-library-wrap" id="multimedija">
          <div className="mh-section mh-library" data-mh-reveal>
            <div className="mh-section-heading">
              <div>
                <p className="mh-eyebrow">
                  <span className="mh-section-number">05 /</span> DIGITALNA
                  KNJIŽNICA
                </p>
                <h2>
                  Znanje u više oblika.
                  <br />
                  <em>Jednako otvoreni horizonti.</em>
                </h2>
              </div>
              <a
                href="/knjiznica"
                className="mh-inline-link"
                onClick={e => link(e, "/knjiznica")}
              >
                Otvori knjižnicu
                <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="mh-library-links">
              {LIBRARY_LINKS.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    href={item.href}
                    onClick={e => link(e, item.href)}
                    key={item.kind}
                  >
                    <Icon size={24} strokeWidth={1.4} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <ArrowUpRight size={18} />
                  </a>
                );
              })}
            </div>
            <div className="mh-multimedia-heading">
              <h3>Perspektive koje vrijedi poslušati.</h3>
              <span>VIDEO / MANSALPHA</span>
            </div>
            <div className="mh-video-grid">
              {HOMEPAGE_VIDEOS.map((video, index) => (
                <HomepageVideo key={video.id} video={video} index={index} />
              ))}
            </div>
            <p className="mh-video-privacy">
              <ShieldCheck size={14} />
              YouTube se učitava tek na vaš odabir. Reprodukcija ovisi o
              dopuštenjima autora i pravilima YouTubea.
            </p>
            {presentations.length > 0 && (
              <div className="mh-presentation-shelf">
                <div>
                  <span className="mh-eyebrow">ZA DUBLJE ISTRAŽIVANJE</span>
                  <h3>Ideje spremne za novi pogled.</h3>
                  <a
                    href="/prezentacije"
                    onClick={e => link(e, "/prezentacije")}
                    className="mh-small-link"
                  >
                    Sve prezentacije
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <div>
                  {presentations.map(record => (
                    <button key={record.id} onClick={() => onOpen(record)}>
                      <Presentation size={20} />
                      <span>
                        <strong>{record.title}</strong>
                        <small>{record.format || "Edukativni materijal"}</small>
                      </span>
                      <ArrowUpRight size={17} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="mh-manifest" id="manifest" data-mh-reveal>
          <div className="mh-manifest-light" />
          <div className="mh-section">
            <p className="mh-eyebrow">MANSALPHA / MANIFEST</p>
            <span className="mh-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>{MANIFESTO}</blockquote>
            <div className="mh-manifest-bottom">
              <span className="mh-editorial-rule" />
              <p>
                Kritičko razmišljanje. Intelektualna znatiželja. Znanstvena
                vjerodostojnost.
                <br />I tehnologija koja poštuje čovjeka.
              </p>
              <a
                href="/postavke"
                className="mh-inline-link"
                onClick={e => link(e, "/postavke")}
              >
                Načela odgovornog znanja
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <section className="mh-section mh-vision" id="vizija" data-mh-reveal>
          <div className="mh-section-heading">
            <div>
              <p className="mh-eyebrow">
                <span className="mh-section-number">06 /</span> POGLED UNAPRIJED
              </p>
              <h2>
                Budućnost počinje
                <br />
                <em>razumijevanjem.</em>
              </h2>
            </div>
            <p>
              Gradimo multidisciplinarni edukativni ekosustav: istraživanje,
              digitalno učenje i kreativnost koji se nastavljaju kroz razgovor.
            </p>
          </div>
          <div className="mh-vision-grid">
            <a
              className="mh-vision-main"
              href="/predavanje"
              onClick={e => link(e, "/predavanje")}
            >
              <span className="mh-planned">
                <i />U PRIPREMI
              </span>
              <CalendarDays size={33} strokeWidth={1.3} />
              <h3>
                Od ideje
                <br />
                do prvog predavanja.
              </h3>
              <p>
                Edukativni susret za 20–30 sudionika. Termin i prostor još nisu
                potvrđeni.
              </p>
              <span className="mh-area-cta">
                Istraži pripremu predavanja
                <ArrowUpRight size={18} />
              </span>
            </a>
            <div className="mh-vision-side">
              <a href="/ideje" onClick={e => link(e, "/ideje")}>
                <span className="mh-eyebrow">SMJER RAZVOJA</span>
                <Lightbulb size={24} />
                <h3>Radionice i nove ideje</h3>
                <p>
                  Prostor za buduće edukativne inicijative, istraživačka pitanja
                  i kreativne suradnje.
                </p>
                <span className="mh-small-link">
                  Pogledaj bilježnicu ideja
                  <ArrowUpRight size={16} />
                </span>
              </a>
              <a href="/dogadaji" onClick={e => link(e, "/dogadaji")}>
                <span className="mh-eyebrow">PLANIRANE AKTIVNOSTI</span>
                <BookOpen size={24} />
                <h3>Učenje koje povezuje</h3>
                <p>
                  Predavanja i digitalni materijali u razvoju. Potvrđene najave
                  dodaju se tek nakon dogovora.
                </p>
                <span className="mh-small-link">
                  Pregled događaja
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </div>
          </div>
        </section>
        <AuthorSection onNavigate={onNavigate} />
        <section className="mh-closing">
          <div className="mh-section">
            <p className="mh-eyebrow">VAŠ SLJEDEĆI KORAK</p>
            <h2>
              Znatiželja otvara vrata.
              <br />
              <em>Znanje širi horizont.</em>
            </h2>
            <a
              className="mh-button mh-button-primary"
              href="/knjiznica"
              onClick={e => link(e, "/knjiznica")}
            >
              Istraži MansAlpha
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <footer className="mh-footer">
        <div className="mh-section">
          <div className="mh-footer-top">
            <div>
              <a className="mh-brand" href="/" onClick={e => link(e, "/")}>
                <img src="/logo.svg" width="34" height="34" alt="" />
                <span>
                  MansAlpha<span className="mh-brand-point">.</span>
                </span>
              </a>
              <p>
                Znanje. Razumijevanje.
                <br />
                Razvoj čovjeka.
              </p>
            </div>
            <nav aria-label="Knjižnica u podnožju">
              <span>ISTRAŽITE</span>
              <a href="/clanci" onClick={e => link(e, "/clanci")}>
                Članci
              </a>
              <a href="/prezentacije" onClick={e => link(e, "/prezentacije")}>
                Prezentacije
              </a>
              <a href="/videozapisi" onClick={e => link(e, "/videozapisi")}>
                Videozapisi
              </a>
              <a href="/izvori" onClick={e => link(e, "/izvori")}>
                Izvori
              </a>
            </nav>
            <nav aria-label="Projekt u podnožju">
              <span>MANSALPHA</span>
              <a href="#o-mansalpha">O MansAlpha</a>
              <a href="#autor">O autoru</a>
              <a href="#manifest">Naša filozofija</a>
              <a href="#vizija">Budući razvoj</a>
              <a href="/postavke" onClick={e => link(e, "/postavke")}>
                Privatnost i načela
              </a>
              <a href="/pregled" onClick={e => link(e, "/pregled")}>
                Radni prostor
              </a>
            </nav>
          </div>
          <div className="mh-footer-bottom">
            <span>© MansAlpha · edukativna i kreativna platforma</span>
            <span>Edukativni prostor. Nije zamjena za stručnu pomoć.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
