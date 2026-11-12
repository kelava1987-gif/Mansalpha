import { useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "./MansalphaUI";
import {
  TOPICS,
  STATUSES,
  KIND_LABELS,
  type ContentRecord,
  type Kind,
} from "@shared/mansalpha";
export default function ContentEditor({
  record,
  onSave,
  onClose,
  saving,
}: {
  record: ContentRecord;
  onSave: (r: ContentRecord) => Promise<boolean>;
  onClose: () => void;
  saving: boolean;
}) {
  const [draft, setDraft] = useState({ ...record });
  const [error, setError] = useState("");
  const change = (key: keyof ContentRecord, value: any) =>
    setDraft(prev => ({ ...prev, [key]: value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!draft.title.trim()) {
      setError("Unesite naslov sadržaja.");
      return;
    }
    const okay = await onSave({ ...draft, title: draft.title.trim() });
    if (okay) onClose();
  }
  return (
    <Modal
      title={record.title ? "Uredi sadržaj" : "Novi sadržaj"}
      description="Svaka ideja zaslužuje jasan oblik. Spremite sadržaj u svoj radni prostor."
      onClose={onClose}
      wide
    >
      <form onSubmit={submit} className="editor-form">
        <div className="form-row">
          <label>
            Vrsta sadržaja
            <select
              value={draft.kind}
              onChange={e => change("kind", e.target.value as Kind)}
            >
              {Object.entries(KIND_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={draft.status}
              onChange={e => change("status", e.target.value)}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Naslov
          <input
            value={draft.title}
            onChange={e => change("title", e.target.value)}
            placeholder="Kako biste nazvali ovu ideju?"
            required
            maxLength={300}
          />
        </label>
        <label>
          Kratki opis
          <textarea
            rows={2}
            value={draft.summary}
            onChange={e => change("summary", e.target.value)}
            placeholder="Sažetak koji olakšava pronalaženje sadržaja"
          />
        </label>
        <fieldset>
          <legend>Tematske oznake</legend>
          <div className="topic-picker">
            {TOPICS.map(t => (
              <button
                key={t}
                className={`topic-chip ${draft.topics.includes(t) ? "selected" : ""}`}
                type="button"
                onClick={() =>
                  change(
                    "topics",
                    draft.topics.includes(t)
                      ? draft.topics.filter(x => x !== t)
                      : [...draft.topics, t]
                  )
                }
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          Sadržaj <span className="optional">Markdown je podržan</span>
          <textarea
            rows={10}
            value={draft.content}
            onChange={e => change("content", e.target.value)}
            placeholder="Tekst, struktura prezentacije, bilješke ili detalji događaja…"
          />
        </label>
        <div className="form-row">
          <label>
            Povezani materijal <span className="optional">HTTPS URL</span>
            <input
              type="text"
              value={draft.assetUrl}
              onChange={e => change("assetUrl", e.target.value)}
              placeholder="https://… ili /manus-storage/…"
            />
          </label>
          <label>
            Format
            <input
              value={draft.format}
              onChange={e => change("format", e.target.value)}
              placeholder="PDF, PPTX, tekst…"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Fotografija <span className="optional">URL</span>
            <input
              value={draft.imageUrl}
              onChange={e => change("imageUrl", e.target.value)}
              placeholder="https://…"
            />
          </label>
          <label>
            Videozapis <span className="optional">YouTube ili MP4</span>
            <input
              value={draft.videoUrl}
              onChange={e => change("videoUrl", e.target.value)}
              placeholder="https://…"
            />
          </label>
        </div>
        <label>
          Napomena o izvoru
          <textarea
            rows={2}
            value={draft.sourceNote}
            onChange={e => change("sourceNote", e.target.value)}
            placeholder="Navedite provjeren izvor ili označite da je potrebna provjera."
          />
        </label>
        <div className="editor-note">
          Ne unosite osjetljive osobne podatke ili privatne narative. Datum,
          autorstvo i izvore dodajte samo ako su provjereni.
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="button secondary" onClick={onClose}>
            Odustani
          </button>
          <button className="button primary" disabled={saving}>
            <Save size={16} />
            {saving ? "Spremanje…" : "Spremi sadržaj"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
