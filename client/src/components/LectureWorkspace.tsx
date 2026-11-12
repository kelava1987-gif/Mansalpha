import { useState } from "react";
import {
  Save,
  Download,
  Users,
  CalendarDays,
  MapPin,
  Plus,
  Trash2,
  Check,
  FileText,
  ClipboardList,
  FolderOpen,
  ContactRound,
  Megaphone,
  NotebookPen,
  Clock3,
} from "lucide-react";
import type { Workspace, Lecture, ContentRecord } from "@shared/mansalpha";
import { STATUSES } from "@shared/mansalpha";
import { downloadText } from "@/lib/content";
import { AssetLink } from "./MansalphaUI";
export default function LectureWorkspace({
  workspace,
  persist,
  saving,
  requireLogin,
  onOpen,
}: {
  workspace: Workspace;
  persist: (w: Workspace) => Promise<boolean>;
  saving: boolean;
  requireLogin: () => boolean;
  onOpen: (r: ContentRecord) => void;
}) {
  const [draft, setDraft] = useState<Lecture>(
    structuredClone(workspace.lecture)
  );
  const [tab, setTab] = useState("tasks");
  const [task, setTask] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(workspace.lecture);
  const completed = draft.tasks.filter(t => t.done).length;
  const progress = draft.tasks.length
    ? Math.round((completed / draft.tasks.length) * 100)
    : 0;
  function change(next: Lecture) {
    if (requireLogin()) setDraft(next);
  }
  async function save() {
    if (!requireLogin()) return;
    await persist({ ...workspace, lecture: draft });
  }
  function exportLecture() {
    const text = `# ${draft.title}\n\nSudionici: ${draft.audience}\nTermin: ${draft.date || "nije određen"}\nLokacija: ${draft.location || "nije određena"}\n\n## Zadaci\n${draft.tasks.map(t => `- [${t.done ? "x" : " "}] ${t.text}`).join("\n")}\n\n## Predložena struktura\n${draft.agenda.map(a => `- ${a.title} (${a.duration})`).join("\n")}\n\n## Materijali\n${workspace.records
      .filter(r => draft.materialIds.includes(r.id))
      .map(r => `- ${r.title}${r.assetUrl ? " — " + r.assetUrl : ""}`)
      .join(
        "\n"
      )}\n\n## Kontakti\n${draft.contacts.map(c => `${c.name} · ${c.role} · ${c.email}`).join("\n")}\n\n## Promotivne objave\n${draft.promotions.map(p => `### ${p.channel} · ${p.status}\n${p.text}`).join("\n\n")}\n\n## Bilješke predavača\n${draft.notes}`;
    downloadText(text, "mansalpha-prvo-predavanje.md");
  }
  const tabs = [
    { id: "tasks", label: "Zadaci", icon: ClipboardList },
    { id: "materials", label: "Materijali", icon: FolderOpen },
    { id: "contacts", label: "Kontakti", icon: ContactRound },
    { id: "promotions", label: "Promocija", icon: Megaphone },
    { id: "notes", label: "Bilješke", icon: NotebookPen },
  ];
  return (
    <>
      <section className="lecture-intro">
        <div>
          <span className="eyebrow">MANSALPHA · PRVO PREDAVANJE</span>
          <h2>{draft.title}</h2>
          <p>
            Od prve ideje do razgovora sa sudionicima — sve na jednom mjestu.
          </p>
          <div className="intro-facts">
            <span>
              <Users size={16} />
              {draft.audience}
            </span>
            <span>
              <CalendarDays size={16} />
              {draft.date || "Termin nije određen"}
            </span>
            <span>
              <MapPin size={16} />
              {draft.location || "Lokacija nije određena"}
            </span>
          </div>
        </div>
        <div
          className="progress-ring"
          style={{
            background: `conic-gradient(var(--mh-blue, #67c7f0) ${progress}%, var(--mh-surface-raised, #101e32) 0)`,
          }}
        >
          <div>
            <strong>{progress}%</strong>
            <span>spremno</span>
          </div>
        </div>
      </section>
      <div className="lecture-toolbar">
        <div className="tabs">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={tab === t.id ? "active" : ""}
                onClick={() => setTab(t.id)}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="button-group">
          <button className="button secondary" onClick={exportLecture}>
            <Download size={16} />
            Izvezi plan
          </button>
          <button
            className="button primary"
            onClick={save}
            disabled={saving || !dirty}
          >
            <Save size={16} />
            {saving ? "Spremanje…" : "Spremi promjene"}
          </button>
        </div>
      </div>
      {dirty && (
        <div className="unsaved-note">
          Imate nespremljene promjene. Spremite ih prije izlaska iz ovog modula.
        </div>
      )}
      {tab === "tasks" && (
        <div className="lecture-body-columns">
          <section className="white-panel">
            <div className="section-heading">
              <div>
                <h2>Popis zadataka</h2>
                <p>
                  {completed} od {draft.tasks.length} dovršeno
                </p>
              </div>
              <ClipboardList size={21} />
            </div>
            <div className="task-list">
              {draft.tasks.map(t => (
                <div className={`task-item ${t.done ? "done" : ""}`} key={t.id}>
                  <button
                    className="task-checkbox"
                    aria-label={`${t.done ? "Označi nedovršenim" : "Dovrši"}: ${t.text}`}
                    onClick={() =>
                      change({
                        ...draft,
                        tasks: draft.tasks.map(x =>
                          x.id === t.id ? { ...x, done: !x.done } : x
                        ),
                      })
                    }
                  >
                    {t.done && <Check size={14} />}
                  </button>
                  <span>{t.text}</span>
                  <button
                    className="icon-button subtle"
                    aria-label={`Ukloni zadatak ${t.text}`}
                    onClick={() =>
                      change({
                        ...draft,
                        tasks: draft.tasks.filter(x => x.id !== t.id),
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <form
              className="add-task"
              onSubmit={e => {
                e.preventDefault();
                if (task.trim() && requireLogin()) {
                  setDraft({
                    ...draft,
                    tasks: [
                      ...draft.tasks,
                      {
                        id: crypto.randomUUID(),
                        text: task.trim(),
                        done: false,
                      },
                    ],
                  });
                  setTask("");
                }
              }}
            >
              <input
                placeholder="Dodajte novi zadatak…"
                value={task}
                onChange={e => setTask(e.target.value)}
              />
              <button className="icon-button" aria-label="Dodaj zadatak">
                <Plus size={19} />
              </button>
            </form>
          </section>
          <section className="white-panel">
            <div className="section-heading">
              <div>
                <h2>Osnovni okvir</h2>
                <p>Bez pretpostavljenih podataka.</p>
              </div>
            </div>
            <div className="editor-form">
              <label>
                Naslov predavanja
                <input
                  value={draft.title}
                  onChange={e => change({ ...draft, title: e.target.value })}
                />
              </label>
              <label>
                Sudionici
                <input
                  value={draft.audience}
                  onChange={e => change({ ...draft, audience: e.target.value })}
                />
              </label>
              <label>
                Termin <span className="optional">opcionalno</span>
                <input
                  type="datetime-local"
                  value={draft.date}
                  onChange={e => change({ ...draft, date: e.target.value })}
                />
              </label>
              <label>
                Lokacija
                <input
                  value={draft.location}
                  placeholder="Dodajte nakon potvrde prostora"
                  onChange={e => change({ ...draft, location: e.target.value })}
                />
              </label>
            </div>
            <h3 className="subheading">
              <Clock3 size={17} />
              Predložena struktura
            </h3>
            <p className="muted">
              Radni prijedlog; trajanje prilagodite publici.
            </p>
            <div className="agenda-list">
              {draft.agenda.map(a => (
                <div key={a.id}>
                  <input
                    aria-label="Dio programa"
                    value={a.title}
                    onChange={e =>
                      change({
                        ...draft,
                        agenda: draft.agenda.map(x =>
                          x.id === a.id ? { ...x, title: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <input
                    aria-label="Trajanje"
                    value={a.duration}
                    onChange={e =>
                      change({
                        ...draft,
                        agenda: draft.agenda.map(x =>
                          x.id === a.id ? { ...x, duration: e.target.value } : x
                        ),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
      {tab === "materials" && (
        <section className="white-panel">
          <div className="section-heading">
            <div>
              <h2>Materijali za predavanje</h2>
              <p>
                Odaberite sadržaje iz knjižnice. {draft.materialIds.length}{" "}
                povezano.
              </p>
            </div>
            <FolderOpen size={22} />
          </div>
          <div className="materials-list">
            {workspace.records
              .filter(r =>
                ["article", "presentation", "source", "video"].includes(r.kind)
              )
              .map(r => (
                <div key={r.id}>
                  <input
                    type="checkbox"
                    aria-label={`Poveži ${r.title}`}
                    checked={draft.materialIds.includes(r.id)}
                    onChange={() =>
                      change({
                        ...draft,
                        materialIds: draft.materialIds.includes(r.id)
                          ? draft.materialIds.filter(id => id !== r.id)
                          : [...draft.materialIds, r.id],
                      })
                    }
                  />
                  <FileText size={21} />
                  <button className="material-title" onClick={() => onOpen(r)}>
                    <strong>{r.title}</strong>
                    <span>
                      {r.format || r.kind} · {r.topics.join(" · ")}
                    </span>
                  </button>
                  {r.assetUrl && (
                    <AssetLink
                      url={r.assetUrl}
                      title={r.title}
                      label="Otvori"
                    />
                  )}
                </div>
              ))}
          </div>
        </section>
      )}
      {tab === "contacts" && (
        <section className="white-panel">
          <div className="section-heading">
            <div>
              <h2>Kontakti i suradnici</h2>
              <p>Unesite samo osobe i podatke koje ste ovlašteni koristiti.</p>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                change({
                  ...draft,
                  contacts: [
                    ...draft.contacts,
                    { id: crypto.randomUUID(), name: "", role: "", email: "" },
                  ],
                })
              }
            >
              <Plus size={16} />
              Dodaj kontakt
            </button>
          </div>
          {!draft.contacts.length && (
            <div className="empty-state compact">
              <ContactRound size={30} />
              <h3>Kontakti još nisu dodani.</h3>
              <p>
                Podaci o organizatorima, prostoru i suradnicima ostaju prazni do
                vaše potvrde.
              </p>
            </div>
          )}
          {draft.contacts.map(c => (
            <div key={c.id} className="contact-row">
              <label>
                Ime i prezime
                <input
                  value={c.name}
                  onChange={e =>
                    change({
                      ...draft,
                      contacts: draft.contacts.map(x =>
                        x.id === c.id ? { ...x, name: e.target.value } : x
                      ),
                    })
                  }
                />
              </label>
              <label>
                Uloga
                <input
                  value={c.role}
                  onChange={e =>
                    change({
                      ...draft,
                      contacts: draft.contacts.map(x =>
                        x.id === c.id ? { ...x, role: e.target.value } : x
                      ),
                    })
                  }
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={c.email}
                  onChange={e =>
                    change({
                      ...draft,
                      contacts: draft.contacts.map(x =>
                        x.id === c.id ? { ...x, email: e.target.value } : x
                      ),
                    })
                  }
                />
              </label>
              <button
                className="icon-button"
                aria-label="Ukloni kontakt"
                onClick={() =>
                  change({
                    ...draft,
                    contacts: draft.contacts.filter(x => x.id !== c.id),
                  })
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </section>
      )}
      {tab === "promotions" && (
        <section className="white-panel">
          <div className="section-heading">
            <div>
              <h2>Promotivne objave</h2>
              <p>
                Nacrti za ručno uređivanje i preuzimanje. Objave se ne šalju
                automatski.
              </p>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                change({
                  ...draft,
                  promotions: [
                    ...draft.promotions,
                    {
                      id: crypto.randomUUID(),
                      channel: "Nova objava",
                      text: "",
                      status: "ideja",
                    },
                  ],
                })
              }
            >
              <Plus size={16} />
              Nova objava
            </button>
          </div>
          <div className="promotions-grid">
            {draft.promotions.map(p => (
              <div className="promotion-card editor-form" key={p.id}>
                <div className="form-row">
                  <label>
                    Kanal
                    <input
                      value={p.channel}
                      onChange={e =>
                        change({
                          ...draft,
                          promotions: draft.promotions.map(x =>
                            x.id === p.id
                              ? { ...x, channel: e.target.value }
                              : x
                          ),
                        })
                      }
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={p.status}
                      onChange={e =>
                        change({
                          ...draft,
                          promotions: draft.promotions.map(x =>
                            x.id === p.id
                              ? {
                                  ...x,
                                  status: e.target.value as typeof p.status,
                                }
                              : x
                          ),
                        })
                      }
                    >
                      {STATUSES.map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Tekst
                  <textarea
                    rows={9}
                    value={p.text}
                    onChange={e =>
                      change({
                        ...draft,
                        promotions: draft.promotions.map(x =>
                          x.id === p.id ? { ...x, text: e.target.value } : x
                        ),
                      })
                    }
                  />
                </label>
                <button
                  className="button secondary"
                  onClick={() =>
                    downloadText(p.text, "mansalpha-promotivna-objava.txt")
                  }
                >
                  <Download size={16} />
                  Preuzmi tekst
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {tab === "notes" && (
        <section className="white-panel editor-form">
          <div className="section-heading">
            <div>
              <h2>Bilješke predavača</h2>
              <p>Osobni radni tekst. Ne dodajte privatne priče sudionika.</p>
            </div>
            <NotebookPen size={22} />
          </div>
          <textarea
            rows={22}
            value={draft.notes}
            onChange={e => change({ ...draft, notes: e.target.value })}
            placeholder="Uvod, ključne poruke, pitanja za raspravu, prijelazi i podsjetnici…"
          />
          <div className="editorial-callout">
            <FileText size={20} />
            <p>
              Razlikujte autorske teze od provjerenih činjenica. Upozorite na
              granice AI-ja i jasno istaknite da edukacija nije klinička
              procjena.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
