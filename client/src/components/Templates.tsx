import { useState } from "react";
import {
  FileText,
  Presentation,
  MessageSquare,
  Mail,
  Plus,
  Copy,
  Download,
  Pencil,
  Save,
} from "lucide-react";
import type {
  ContentTemplate,
  Workspace,
  ContentRecord,
} from "@shared/mansalpha";
import { emptyRecord } from "@shared/mansalpha";
import { downloadText, slug } from "@/lib/content";
import { Modal } from "./MansalphaUI";
import { toast } from "sonner";
const labels = {
  article: "Članak",
  presentation: "Prezentacija",
  post: "Objava",
  email: "E-mail",
};
const icons = {
  article: FileText,
  presentation: Presentation,
  post: MessageSquare,
  email: Mail,
};
export default function Templates({
  workspace,
  persist,
  saving,
  onUse,
  requireLogin,
}: {
  workspace: Workspace;
  persist: (w: Workspace) => Promise<boolean>;
  saving: boolean;
  onUse: (r: ContentRecord) => void;
  requireLogin: () => boolean;
}) {
  const [draft, setDraft] = useState<ContentTemplate | null>(null);
  const [filter, setFilter] = useState("");
  const edit = (t?: ContentTemplate) => {
    if (!requireLogin()) return;
    setDraft(
      t || { id: crypto.randomUUID(), title: "", type: "article", content: "" }
    );
  };
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const next = {
      ...workspace,
      templates: [...workspace.templates.filter(t => t.id !== draft.id), draft],
    };
    if (await persist(next)) setDraft(null);
  }
  function use(t: ContentTemplate) {
    if (!requireLogin()) return;
    onUse({
      ...emptyRecord(t.type === "presentation" ? "presentation" : "article"),
      title: t.title,
      content: t.content,
      summary: `Nacrt prema predlošku „${t.title}”.`,
      status: "u izradi",
    });
  }
  return (
    <>
      <div className="template-toolbar">
        <div className="tabs">
          <button
            className={!filter ? "active" : ""}
            onClick={() => setFilter("")}
          >
            Svi predlošci
          </button>
          {Object.entries(labels).map(([k, l]) => (
            <button
              key={k}
              className={filter === k ? "active" : ""}
              onClick={() => setFilter(k)}
            >
              {l}
            </button>
          ))}
        </div>
        <button className="button primary" onClick={() => edit()}>
          <Plus size={16} />
          Novi predložak
        </button>
      </div>
      <div className="template-grid">
        {workspace.templates
          .filter(t => !filter || t.type === filter)
          .map(t => {
            const Icon = icons[t.type];
            return (
              <article className="template-card" key={t.id}>
                <span className="template-icon">
                  <Icon size={24} />
                </span>
                <span className="tiny-label">
                  {labels[t.type].toUpperCase()}
                </span>
                <h3>{t.title}</h3>
                <pre>{t.content.slice(0, 250)}</pre>
                <div className="template-actions">
                  <button className="button primary" onClick={() => use(t)}>
                    <Copy size={15} />
                    Upotrijebi
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Uredi ${t.title}`}
                    onClick={() => edit(t)}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`Preuzmi ${t.title}`}
                    onClick={() =>
                      downloadText(t.content, `${slug(t.title)}.md`)
                    }
                  >
                    <Download size={17} />
                  </button>
                </div>
              </article>
            );
          })}
      </div>
      <div className="editorial-callout">
        <MessageSquare size={22} />
        <div>
          <strong>Predložak je polazište, ne gotova tvrdnja.</strong>
          <p>
            Uglate zagrade zamijenite samo provjerenim podacima. Prije objave
            provjerite izvore i uklonite osobne podatke.
          </p>
        </div>
      </div>
      {draft && (
        <Modal
          title={
            workspace.templates.some(t => t.id === draft.id)
              ? "Uredi predložak"
              : "Novi predložak"
          }
          onClose={() => setDraft(null)}
          wide
        >
          <form className="editor-form" onSubmit={save}>
            <div className="form-row">
              <label>
                Naziv
                <input
                  required
                  value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })}
                />
              </label>
              <label>
                Vrsta
                <select
                  value={draft.type}
                  onChange={e =>
                    setDraft({
                      ...draft,
                      type: e.target.value as ContentTemplate["type"],
                    })
                  }
                >
                  {Object.entries(labels).map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Sadržaj predloška
              <textarea
                rows={15}
                required
                value={draft.content}
                onChange={e => setDraft({ ...draft, content: e.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button
                className="button secondary"
                type="button"
                onClick={() => setDraft(null)}
              >
                Odustani
              </button>
              <button className="button primary" disabled={saving}>
                <Save size={16} />
                Spremi predložak
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
