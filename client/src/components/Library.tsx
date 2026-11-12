import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Plus,
  FileText,
  Presentation,
  Play,
  Link2,
  CalendarDays,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import {
  TOPICS,
  STATUSES,
  KIND_LABELS,
  type ContentRecord,
  type Kind,
} from "@shared/mansalpha";
import { Badge } from "./MansalphaUI";
export const kindIcons = {
  article: FileText,
  presentation: Presentation,
  video: Play,
  source: Link2,
  event: CalendarDays,
  idea: Lightbulb,
};
export function RecordCard({
  record,
  onOpen,
}: {
  record: ContentRecord;
  onOpen: (r: ContentRecord) => void;
}) {
  const Icon = kindIcons[record.kind];
  return (
    <button className="record-card" onClick={() => onOpen(record)}>
      <div className={`record-visual visual-${record.kind}`}>
        {record.imageUrl ? (
          <img src={record.imageUrl} alt="" loading="lazy" />
        ) : (
          <div className="document-art">
            <Icon size={40} strokeWidth={1} />
            <span>MANSALPHA</span>
            <span>{record.format || KIND_LABELS[record.kind]}</span>
          </div>
        )}
        <span className="format-pill">
          <Icon size={12} />
          {record.format || KIND_LABELS[record.kind]}
        </span>
        {record.kind === "video" && (
          <span className="play-circle">
            <Play size={18} fill="currentColor" />
          </span>
        )}
      </div>
      <div className="record-card-body">
        <div className="record-meta">
          <span>{record.topics[0] || "Mansalpha"}</span>
          <Badge status={record.status} />
        </div>
        <h3>{record.title}</h3>
        <p>{record.summary}</p>
        <div className="record-footer">
          <span>{KIND_LABELS[record.kind]}</span>
          <ArrowUpRight size={17} />
        </div>
      </div>
    </button>
  );
}
export default function Library({
  records,
  kind,
  search,
  setSearch,
  onOpen,
  onNew,
  initialTopic,
}: {
  records: ContentRecord[];
  kind?: Kind;
  search: string;
  setSearch: (s: string) => void;
  onOpen: (r: ContentRecord) => void;
  onNew: () => void;
  initialTopic?: string;
}) {
  const [topic, setTopic] = useState(initialTopic || "");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState(true);
  const filtered = records.filter(
    r =>
      (!kind || r.kind === kind) &&
      (!type || r.kind === type) &&
      (!topic || r.topics.includes(topic)) &&
      (!status || r.status === status) &&
      (!search ||
        `${r.title} ${r.summary} ${r.content} ${r.topics.join(" ")}`
          .toLocaleLowerCase("hr")
          .includes(search.toLocaleLowerCase("hr")))
  );
  return (
    <>
      <div className="library-toolbar">
        <div className="inline-search">
          <Search size={17} />
          <input
            placeholder="Pretražite naslov, tekst ili temu…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button aria-label="Očisti pretragu" onClick={() => setSearch("")}>
              ×
            </button>
          )}
        </div>
        <button
          className={`button secondary filter-toggle ${filters ? "active" : ""}`}
          onClick={() => setFilters(!filters)}
        >
          <SlidersHorizontal size={16} />
          Filtri
        </button>
        <div className="view-toggle">
          <button
            aria-label="Kartice"
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            <LayoutGrid size={17} />
          </button>
          <button
            aria-label="Popis"
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            <List size={18} />
          </button>
        </div>
      </div>
      {filters && (
        <div className="filter-row">
          {!kind && (
            <select
              aria-label="Vrsta sadržaja"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">Sve vrste sadržaja</option>
              {Object.entries(KIND_LABELS).map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          )}
          <select
            aria-label="Tema"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          >
            <option value="">Sve teme</option>
            {TOPICS.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            aria-label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">Svi statusi</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {(topic || status || type || search) && (
            <button
              className="text-link"
              onClick={() => {
                setTopic("");
                setStatus("");
                setType("");
                setSearch("");
              }}
            >
              Poništi filtre
            </button>
          )}
        </div>
      )}
      <div className="results-label">
        {filtered.length} {filtered.length === 1 ? "materijal" : "materijala"}
        <span>Vaše znanje, pregledno povezano.</span>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <Search size={32} />
          <h3>Nema sadržaja u ovom pogledu.</h3>
          <p>Promijenite filtre ili dodajte svoju prvu ideju.</p>
          <button className="button primary" onClick={onNew}>
            <Plus size={16} />
            Novi sadržaj
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="library-grid">
          {filtered.map(r => (
            <RecordCard key={r.id} record={r} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="record-list">
          {filtered.map(r => {
            const Icon = kindIcons[r.kind];
            return (
              <button
                key={r.id}
                className="record-row"
                onClick={() => onOpen(r)}
              >
                <span className="row-icon">
                  <Icon size={20} />
                </span>
                <div className="row-title">
                  <h3>{r.title}</h3>
                  <p>
                    {r.topics.join(" · ")}
                    {r.format ? ` · ${r.format}` : ""}
                  </p>
                </div>
                <Badge status={r.status} />
                <ArrowUpRight size={18} />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
