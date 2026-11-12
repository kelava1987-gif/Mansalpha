import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  FileText,
  Presentation,
  Play,
  Lightbulb,
  Users,
  CalendarDays,
  MapPin,
  Check,
  Brain,
  Cpu,
  Sparkles,
  ShieldCheck,
  BookOpen,
  HeartPulse,
} from "lucide-react";
import type { Workspace, ContentRecord } from "@shared/mansalpha";
import { TOPICS } from "@shared/mansalpha";
import { RecordCard } from "./Library";
import { TextLink, Badge } from "./MansalphaUI";
import { HOMEPAGE_IMAGES } from "@shared/homepage";
const HERO = HOMEPAGE_IMAGES.ai;
export default function Dashboard({
  workspace,
  onNavigate,
  onOpen,
  onNew,
  onTopic,
}: {
  workspace: Workspace;
  onNavigate: (p: string) => void;
  onOpen: (r: ContentRecord) => void;
  onNew: () => void;
  onTopic: (t: string) => void;
}) {
  const { records, lecture } = workspace;
  const completed = lecture.tasks.filter(t => t.done).length;
  const progress = lecture.tasks.length
    ? Math.round((completed / lecture.tasks.length) * 100)
    : 0;
  const stats = [
    {
      label: "Članci",
      kind: "article",
      path: "/clanci",
      icon: FileText,
      color: "sage",
    },
    {
      label: "Prezentacije",
      kind: "presentation",
      path: "/prezentacije",
      icon: Presentation,
      color: "sand",
    },
    {
      label: "Videozapisi",
      kind: "video",
      path: "/videozapisi",
      icon: Play,
      color: "blue",
    },
    {
      label: "Ideje",
      kind: "idea",
      path: "/ideje",
      icon: Lightbulb,
      color: "lilac",
    },
  ];
  const featured = [
    ...records.filter(r =>
      ["dignity", "mentalno", "osvijetljeni"].includes(r.id)
    ),
    ...records.filter(
      r => !["dignity", "mentalno", "osvijetljeni"].includes(r.id)
    ),
  ].slice(0, 3);
  const topicsIcons = [Cpu, HeartPulse, Brain, BookOpen, Sparkles, ShieldCheck];
  return (
    <>
      <section className="knowledge-banner">
        <div className="banner-copy">
          <div className="eyebrow">
            <span />
            POVEZUJEMO ZNANJE I RAZUMIJEVANJE
          </div>
          <h2>
            Znanje s ljudskom
            <br />
            <span>perspektivom.</span>
          </h2>
          <p>
            Prostor u kojem umjetna inteligencija susreće
            <br className="desktop-break" /> psihologiju, kreativnost i brigu za
            čovjeka.
          </p>
          <button
            className="button primary"
            onClick={() => onNavigate("/knjiznica")}
          >
            Istražite knjižnicu
            <ArrowUpRight size={17} />
          </button>
        </div>
        <img
          src={HERO}
          alt="Konceptualni prikaz neuralne inteligencije u istraživačkom prostoru"
          className="banner-image"
        />
        <span className="banner-caption">
          ČOVJEK U SREDIŠTU. ZNANJE U POKRETU.
        </span>
      </section>
      <div className="stats-grid">
        {stats.map(s => {
          const Icon = s.icon;
          const count = records.filter(r => r.kind === s.kind).length;
          const ready = records.filter(
            r =>
              r.kind === s.kind &&
              (r.status === "spremno" || r.status === "objavljeno")
          ).length;
          return (
            <button
              className="stat-card"
              key={s.kind}
              onClick={() => onNavigate(s.path)}
            >
              <span className={`stat-icon ${s.color}`}>
                <Icon size={19} strokeWidth={1.7} />
              </span>
              <ArrowUpRight className="stat-arrow" size={16} />
              <div>
                <span className="stat-label">{s.label}</span>
                <strong>{String(count).padStart(2, "0")}</strong>
                <span className="stat-caption">
                  {s.kind === "idea"
                    ? "Prostor za nove perspektive"
                    : `${ready} spremno za čitanje`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="dashboard-columns">
        <section className="recent-section">
          <div className="section-heading">
            <div>
              <h2>Izdvojeno iz knjižnice</h2>
              <p>Materijali koji povezuju naše teme.</p>
            </div>
            <TextLink onClick={() => onNavigate("/knjiznica")}>
              Svi sadržaji
            </TextLink>
          </div>
          <div className="recent-grid">
            {featured.map(r => (
              <RecordCard key={r.id} record={r} onOpen={onOpen} />
            ))}
          </div>
          <section className="topics-section">
            <div className="section-heading">
              <div>
                <h2>Šest perspektiva. Jedna cjelina.</h2>
                <p>Istražite znanje kroz područje koje vas zanima.</p>
              </div>
            </div>
            <div className="topics-grid">
              {TOPICS.map((t, i) => {
                const Icon = topicsIcons[i];
                return (
                  <button key={t} onClick={() => onTopic(t)}>
                    <Icon size={20} strokeWidth={1.5} />
                    <span>{t}</span>
                    <ArrowUpRight size={14} />
                  </button>
                );
              })}
            </div>
          </section>
          <div className="editorial-callout">
            <ShieldCheck size={23} />
            <div>
              <strong>Odgovorno znanje počinje jasnim granicama.</strong>
              <p>
                Edukativni sadržaji, transparentni izvori i poštovanje
                privatnosti. Bez dijagnoza, etiketa i neprovjerenih tvrdnji.
              </p>
            </div>
          </div>
        </section>
        <aside className="dashboard-right">
          <section className="lecture-card">
            <div className="section-heading">
              <h2>Prvo predavanje</h2>
              <span className="tiny-label">U PRIPREMI</span>
            </div>
            <div className="lecture-symbol">
              <span className="mini-brand">
                m<span>+</span>
              </span>
              <span>
                MANSALPHA
                <br />
                <small>ZNANJE KOJE DIJELIMO</small>
              </span>
            </div>
            <h3>{lecture.title}</h3>
            <div className="lecture-facts">
              <span>
                <Users size={15} />
                {lecture.audience}
              </span>
              <span>
                <CalendarDays size={15} />
                {lecture.date || "Termin još nije određen"}
              </span>
              <span>
                <MapPin size={15} />
                {lecture.location || "Lokacija još nije određena"}
              </span>
            </div>
            <div className="progress-label">
              <span>Spremnost predavanja</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-detail">
              {completed} od {lecture.tasks.length} zadataka dovršeno
            </p>
            <button
              className="button primary wide"
              onClick={() => onNavigate("/predavanje")}
            >
              Nastavi pripremu
              <ArrowRight size={16} />
            </button>
          </section>
          <section className="next-tasks">
            <div className="section-heading">
              <h2>Sljedeći koraci</h2>
              <TextLink onClick={() => onNavigate("/predavanje")}>Svi</TextLink>
            </div>
            {lecture.tasks
              .filter(t => !t.done)
              .slice(0, 3)
              .map(t => (
                <button key={t.id} onClick={() => onNavigate("/predavanje")}>
                  <span className="task-circle" />
                  <span>{t.text}</span>
                  <ArrowUpRight size={14} />
                </button>
              ))}
            {lecture.tasks.every(t => t.done) && (
              <p className="muted">Svi zadaci su dovršeni.</p>
            )}
          </section>
          <button className="idea-prompt" onClick={onNew}>
            <span className="idea-prompt-icon">
              <Lightbulb size={20} />
            </span>
            <div>
              <strong>Imate novu ideju?</strong>
              <p>Zabilježite je prije nego odleti.</p>
            </div>
            <Plus size={18} />
          </button>
        </aside>
      </div>
      <section className="status-overview">
        <div>
          <span className="eyebrow">OD IDEJE DO OBJAVE</span>
          <h3>Svaki sadržaj ima svoj put.</h3>
        </div>
        <div className="status-counts">
          {(["ideja", "u izradi", "spremno", "objavljeno"] as const).map(s => (
            <button key={s} onClick={() => onNavigate("/knjiznica")}>
              <Badge status={s} />
              <strong>{records.filter(r => r.status === s).length}</strong>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
