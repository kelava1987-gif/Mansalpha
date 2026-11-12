import { useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Presentation,
  Play,
  Link2,
  CalendarDays,
  Lightbulb,
  Layers3,
  Settings2,
  Search,
  Plus,
  Bell,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
  LogOut,
  Loader2,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { useWorkspace } from "@/hooks/useWorkspace";
import { emptyRecord, type ContentRecord, type Kind } from "@shared/mansalpha";
import Dashboard from "@/components/Dashboard";
import Library from "@/components/Library";
import Templates from "@/components/Templates";
import LectureWorkspace from "@/components/LectureWorkspace";
import Settings from "@/components/Settings";
import ContentEditor from "@/components/ContentEditor";
import ContentDetail from "@/components/ContentDetail";
import { Modal } from "@/components/MansalphaUI";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import PremiumHomepage from "@/components/homepage/PremiumHomepage";
import HomepageNavigation from "@/components/homepage/HomepageNavigation";
import CuratedVideoShelf from "@/components/platform/CuratedVideoShelf";
import { PLATFORM_PAGE_VISUALS } from "@shared/platform";
import { HOMEPAGE_TITLE, HOMEPAGE_DESCRIPTION } from "@shared/homepage";
import {
  editablePublicRecord,
  homepageQuery,
  withoutDetailQuery,
} from "@/lib/homepageState";
const NAV = [
  { path: "/", label: "Naslovnica", icon: BookOpen },
  { path: "/pregled", label: "Pregled", icon: LayoutDashboard },
  { path: "/knjiznica", label: "Svi sadržaji", icon: BookOpen },
  { path: "/clanci", label: "Članci", icon: FileText, kind: "article" },
  {
    path: "/prezentacije",
    label: "Prezentacije",
    icon: Presentation,
    kind: "presentation",
  },
  { path: "/videozapisi", label: "Videozapisi", icon: Play, kind: "video" },
  {
    path: "/izvori",
    label: "Izvori i literatura",
    icon: Link2,
    kind: "source",
  },
  { path: "/dogadaji", label: "Događaji", icon: CalendarDays, kind: "event" },
  { path: "/ideje", label: "Ideje", icon: Lightbulb, kind: "idea" },
];
const WORK = [
  { path: "/predavanje", label: "Prvo predavanje", icon: UsersIcon },
  { path: "/predlosci", label: "Predlošci", icon: Layers3 },
];
function UsersIcon(props: any) {
  return <Presentation {...props} />;
}
const TITLES: Record<string, { title: string; description: string }> = {
  "/": {
    title: HOMEPAGE_TITLE,
    description: HOMEPAGE_DESCRIPTION,
  },
  "/pregled": {
    title: "Pregled radnog prostora",
    description: "Sve vaše ideje, znanje i materijali. Na jednom mjestu.",
  },
  "/knjiznica": {
    title: "Knjižnica sadržaja",
    description:
      "Povežite znanje. Pronađite materijal. Dajte ideji novi oblik.",
  },
  "/clanci": {
    title: "Članci i edukativni tekstovi",
    description: "Prostor za promišljanje, istraživanje i jasno pisanje.",
  },
  "/prezentacije": {
    title: "Prezentacije",
    description:
      "Složene ideje, pregledno strukturirane i spremne za dijeljenje.",
  },
  "/videozapisi": {
    title: "Videozapisi",
    description: "Znanje u pokretu. Dostupni video sadržaji na jednom mjestu.",
  },
  "/izvori": {
    title: "Izvori i literatura",
    description: "Provjereni temelji za informirane zaključke.",
  },
  "/dogadaji": {
    title: "Događaji",
    description: "Od pripreme do razgovora koji otvara nove perspektive.",
  },
  "/ideje": {
    title: "Bilježnica ideja",
    description: "Svako istraživanje počinje pitanjem. Sačuvajte svoje.",
  },
  "/predavanje": {
    title: "Priprema prvog predavanja",
    description: "Vaš radni prostor za susret s 20–30 sudionika.",
  },
  "/predlosci": {
    title: "Predlošci",
    description: "Manje ponavljanja. Više prostora za sadržaj.",
  },
  "/postavke": {
    title: "Postavke i načela",
    description: "Siguran radni prostor i transparentan odnos prema znanju.",
  },
};
export default function Home() {
  // Mobilni izbornik zatvara se i dodirom izvan navigacije.
  const [location, navigate] = useLocation();
  const queryString = useSearch();
  const editorial = trpc.editorial.get.useQuery(undefined, {
    enabled: location === "/" || new URLSearchParams(queryString).has("citaj"),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
  const { user, loading: authLoading, logout } = useAuth();
  const [leavingSession, setLeavingSession] = useState(false);
  const store = useWorkspace(
    authLoading || leavingSession ? undefined : (user?.id ?? null)
  );
  const [search, setSearch] = useState(
    new URLSearchParams(queryString).get("q") || ""
  );
  const [mobile, setMobile] = useState(false);
  const [detail, setDetail] = useState<ContentRecord | null>(null);
  const [editor, setEditor] = useState<ContentRecord | null>(null);
  const [login, setLogin] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [profile, setProfile] = useState(false);
  const [topic, setTopic] = useState(
    new URLSearchParams(queryString).get("tema") || ""
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const urlDetailId = useRef<string | null>(null);
  useEffect(() => {
    setDetail(null);
    setEditor(null);
    setNotifications(false);
    setProfile(false);
    setSearch(new URLSearchParams(queryString).get("q") || "");
    setTopic(new URLSearchParams(queryString).get("tema") || "");
  }, [user?.id]);
  useEffect(() => {
    const { search, topic } = homepageQuery(queryString);
    setSearch(search);
    setTopic(topic);
  }, [queryString]);
  useEffect(() => {
    const id = homepageQuery(queryString).detailId;
    if (id && editorial.data) {
      const record = editorial.data.find(r => r.id === id);
      if (record) {
        urlDetailId.current = id;
        setDetail(record);
      } else if (urlDetailId.current) {
        urlDetailId.current = null;
        setDetail(null);
      }
    } else if (!id && urlDetailId.current) {
      urlDetailId.current = null;
      setDetail(null);
    }
  }, [queryString, editorial.data, user?.id]);
  const meta = TITLES[location] || TITLES["/"];
  const nav = NAV.find(n => n.path === location);
  const kind = nav?.kind as Kind | undefined;
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  useEffect(() => {
    document.title =
      location === "/" ? HOMEPAGE_TITLE : `${meta.title} · MansAlpha`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    setMobile(false);
    const anchor = window.location.hash.slice(1);
    if (location === "/" && anchor) {
      requestAnimationFrame(() => {
        const target = document.getElementById(anchor);
        if (target)
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 100,
          });
      });
    } else window.scrollTo(0, 0);
  }, [location, meta.title]);
  function go(path: string) {
    const params = new URLSearchParams(path.split("?")[1] || "");
    setTopic(params.get("tema") || "");
    setSearch(params.get("q") || "");
    navigate(path);
    setMobile(false);
  }
  function requireLogin() {
    if (authLoading) {
      toast.info("Provjeravam prijavu…");
      return false;
    }
    if (!store.authenticated) {
      setLogin(true);
      return false;
    }
    return true;
  }
  function newContent() {
    if (requireLogin()) setEditor(emptyRecord(kind || "article"));
  }
  async function saveRecord(r: ContentRecord) {
    if (!store.workspace) return false;
    return store.persist({
      ...store.workspace,
      records: store.workspace.records.some(x => x.id === r.id)
        ? store.workspace.records.map(x => (x.id === r.id ? r : x))
        : [r, ...store.workspace.records],
    });
  }
  function open(r: ContentRecord) {
    if (location === "/") {
      const params = new URLSearchParams(queryString);
      params.set("citaj", r.id);
      urlDetailId.current = r.id;
      navigate(`/?${params.toString()}`);
    } else {
      urlDetailId.current = null;
    }
    setDetail(r);
  }
  function closeDetail() {
    setDetail(null);
    urlDetailId.current = null;
    if (homepageQuery(queryString).detailId)
      navigate(withoutDetailQuery(location, queryString), { replace: true });
  }
  const workspace = store.workspace;
  const pageVisual =
    PLATFORM_PAGE_VISUALS[location] || PLATFORM_PAGE_VISUALS["/knjiznica"];
  const displayName = user?.name?.trim().split(" ")[0] || "MansAlpha";
  const dialogs = (
    <>
      {detail && (
        <ContentDetail
          record={detail}
          onClose={closeDetail}
          onEdit={() => {
            if (requireLogin()) {
              setEditor(editablePublicRecord(detail, workspace));
              closeDetail();
            }
          }}
        />
      )}{" "}
      {editor && (
        <ContentEditor
          record={editor}
          onClose={() => setEditor(null)}
          onSave={saveRecord}
          saving={store.isSaving}
        />
      )}{" "}
      {login && (
        <Modal
          title="Vaše znanje. Vaš radni prostor."
          description="Prijavite se za trajno spremanje i uređivanje."
          onClose={() => setLogin(false)}
        >
          <div className="login-content">
            <img src="/logo.svg" alt="MansAlpha" />
            <p>
              Prijava putem Manus računa povezuje sadržaje, predloške i pripremu
              predavanja s vašim osobnim prostorom.
            </p>
            <div className="editorial-callout">
              <LockSymbol />
              <p>Vaši nacrti i kontakti nisu dostupni drugim korisnicima.</p>
            </div>
            <button
              className="button primary wide"
              onClick={() => startLogin()}
            >
              <LogIn size={17} />
              Nastavi putem Manus računa
            </button>
            <button
              className="text-link centered"
              onClick={() => setLogin(false)}
            >
              Nastavi pregledavati knjižnicu
            </button>
          </div>
        </Modal>
      )}{" "}
      {notifications && workspace && (
        <Modal
          title="Pregled vašeg radnog prostora"
          description="Stvarni sadržaji i otvoreni zadaci, bez generiranih obavijesti."
          onClose={() => setNotifications(false)}
        >
          <div className="notification-content">
            <h3>Predavanje: otvoreni zadaci</h3>
            {workspace.lecture.tasks
              .filter(t => !t.done)
              .map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setNotifications(false);
                    go("/predavanje");
                  }}
                >
                  <span className="task-circle" />
                  {t.text}
                  <ArrowUpRight size={15} />
                </button>
              ))}
            <p className="muted">
              Knjižnica sadrži {workspace.records.length} zapisa.{" "}
              {workspace.records.filter(r => r.status === "u izradi").length} u
              izradi.
            </p>
          </div>
        </Modal>
      )}{" "}
      {profile && (
        <Modal title="Vaš Manus račun" onClose={() => setProfile(false)}>
          <div className="profile-detail">
            <span className="avatar large">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <h3>{user?.name || "Prijavljeni korisnik"}</h3>
            <p>Vaš osobni radni prostor čuva se u bazi projekta.</p>
            <button
              className="button secondary"
              onClick={async () => {
                setLeavingSession(true);
                setDetail(null);
                setEditor(null);
                setNotifications(false);
                setProfile(false);
                try {
                  await store.clearPrivateCache();
                  await logout();
                } catch {
                  toast.error(
                    "Odjava nije dovršena. Ponovno učitajte stranicu."
                  );
                } finally {
                  setLeavingSession(false);
                }
              }}
            >
              <LogOut size={16} />
              Odjava
            </button>
          </div>
        </Modal>
      )}
    </>
  );
  if (location === "/")
    return (
      <>
        <PremiumHomepage
          records={editorial.data || []}
          loading={editorial.isLoading}
          error={!!editorial.error}
          onRetry={() => void editorial.refetch()}
          onNavigate={go}
          onSearch={q => go(`/knjiznica?q=${encodeURIComponent(q)}`)}
          onOpen={open}
        />
        {dialogs}
      </>
    );
  return (
    <div className="app-shell mh-page mp-platform">
      <a className="mh-skip-link" href="#mp-main">
        Preskoči na sadržaj
      </a>
      <HomepageNavigation
        internalPage
        onNavigate={go}
        onSearch={q => go(`/knjiznica?q=${encodeURIComponent(q)}`)}
      />
      {mobile && (
        <button
          className="mobile-backdrop"
          aria-label="Zatvori navigaciju"
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "open" : ""}`}>
        <a
          className="brand"
          href="/"
          onClick={e => {
            e.preventDefault();
            go("/");
          }}
        >
          <img src="/logo.svg" alt="" />
          <div>
            <span>
              MansAlpha<span className="wordmark-dot">.</span>
            </span>
            <small>ZNANJE. ČOVJEK. PERSPEKTIVA.</small>
          </div>
        </a>
        <button
          className="mobile-close icon-button"
          aria-label="Zatvori izbornik"
          onClick={() => setMobile(false)}
        >
          <X size={20} />
        </button>
        <div className="workspace-switch">
          <span className="workspace-symbol">M</span>
          <div>
            <strong>Vaš prostor znanja</strong>
            <small>Osobni radni prostor</small>
          </div>
          <ChevronRight size={14} />
        </div>
        <nav aria-label="Glavna navigacija">
          <div className="nav-label">KNJIŽNICA</div>
          {NAV.map(n => {
            const Icon = n.icon;
            const count = n.kind
              ? workspace?.records.filter(r => r.kind === n.kind).length
              : undefined;
            return (
              <button
                key={n.path}
                className={`nav-item ${location === n.path ? "active" : ""}`}
                onClick={() => go(n.path)}
              >
                <Icon size={18} strokeWidth={1.65} />
                <span>{n.label}</span>
                {count !== undefined && <small>{count}</small>}
                {location === n.path && !n.kind && (
                  <span className="active-dot" />
                )}
              </button>
            );
          })}
          <div className="nav-label work-label">RADNI PROSTOR</div>
          {WORK.map(n => {
            const Icon = n.icon;
            return (
              <button
                key={n.path}
                className={`nav-item ${location === n.path ? "active" : ""}`}
                onClick={() => go(n.path)}
              >
                <Icon size={18} strokeWidth={1.6} />
                <span>{n.label}</span>
                {n.path === "/predavanje" && <i className="upcoming-dot" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <ShieldCheck size={21} />
            <strong>Čovjek u središtu.</strong>
            <p>
              Znanje bez osude.
              <br />
              Tehnologija s odgovornošću.
            </p>
            <button onClick={() => go("/postavke")}>
              Naša načela
              <ArrowUpRight size={13} />
            </button>
          </div>
          <button
            className={`nav-item ${location === "/postavke" ? "active" : ""}`}
            onClick={() => go("/postavke")}
          >
            <Settings2 size={18} />
            <span>Postavke i načela</span>
          </button>
          <span className="sidebar-footnote">MANSALPHA · PROSTOR ZNANJA</span>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Otvori izbornik"
              onClick={() => setMobile(true)}
            >
              <Menu size={21} />
            </button>
            <span>Radni prostor</span>
            <ChevronRight size={14} />
            <strong>
              {location === "/"
                ? "Pregled"
                : nav?.label ||
                  WORK.find(w => w.path === location)?.label ||
                  "Postavke"}
            </strong>
          </div>
          <div className="topbar-actions">
            <div className="global-search">
              <Search size={17} />
              <input
                ref={searchRef}
                value={search}
                placeholder="Pretražite znanje…"
                onChange={e => {
                  setSearch(e.target.value);
                  if (location !== "/knjiznica") {
                    setTopic("");
                    navigate("/knjiznica");
                  }
                }}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              className="icon-button notification-button"
              aria-label="Pregled zadataka i sadržaja"
              onClick={() => setNotifications(true)}
            >
              <Bell size={19} />
              {workspace?.lecture.tasks.some(t => !t.done) && <span />}
            </button>
            <div className="topbar-divider" />
            {user ? (
              <button
                className="profile-button"
                onClick={() => setProfile(true)}
              >
                <span className="avatar">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
                <span>{displayName}</span>
                <ChevronRight size={13} />
              </button>
            ) : (
              <button className="profile-button" onClick={() => setLogin(true)}>
                <span className="avatar">M</span>
                <span>Prijava</span>
                <LogIn size={15} />
              </button>
            )}
          </div>
        </header>
        <main className="main-content" id="mp-main">
          <div className="page-heading">
            <img
              className="mp-page-image"
              src={pageVisual.image}
              alt=""
              aria-hidden="true"
              width="900"
              height="640"
            />
            <div className="mp-page-shade" aria-hidden="true" />
            <div className="mp-page-copy">
              <div className="page-kicker">MANSALPHA / {pageVisual.label}</div>
              <h1>{meta.title}</h1>
              <p>{meta.description}</p>
            </div>
            {!["/postavke", "/predavanje", "/predlosci"].includes(location) && (
              <div className="mp-page-heading-actions">
                <button className="button primary" onClick={newContent}>
                  <Plus size={17} />
                  Novi sadržaj
                </button>
              </div>
            )}
            <div className="mp-page-meta">
              <span>
                {pageVisual.number} / ZNANJE. RAZUMIJEVANJE. RAZVOJ ČOVJEKA.
              </span>
              <span>
                {location === "/predavanje"
                  ? "20–30 SUDIONIKA · U PRIPREMI"
                  : location === "/postavke"
                    ? "PRIVATNOST I ODGOVORNOST"
                    : location === "/predlosci"
                      ? `${workspace?.templates.length ?? 0} PREDLOŠKA`
                      : `${workspace?.records.filter(r => !kind || r.kind === kind).length ?? 0} ZAPISA U KNJIŽNICI`}
              </span>
            </div>
          </div>
          {store.loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={25} />
              <h3>Pripremamo vaš prostor znanja…</h3>
            </div>
          ) : store.error ? (
            <div className="empty-state">
              <ShieldCheck size={28} />
              <h3>Radni prostor trenutačno nije dostupan.</h3>
              <p>{store.error.message}</p>
              <button className="button primary" onClick={() => store.reload()}>
                Pokušaj ponovno
              </button>
            </div>
          ) : (
            workspace && (
              <>
                {location === "/pregled" ? (
                  <Dashboard
                    workspace={workspace}
                    onNavigate={go}
                    onOpen={open}
                    onNew={() => {
                      if (requireLogin()) setEditor(emptyRecord("idea"));
                    }}
                    onTopic={t => {
                      setSearch("");
                      setTopic(t);
                      navigate("/knjiznica");
                    }}
                  />
                ) : location === "/predavanje" ? (
                  <LectureWorkspace
                    key={`${location}-${user?.id ?? "guest"}`}
                    workspace={workspace}
                    persist={store.persist}
                    saving={store.isSaving}
                    requireLogin={requireLogin}
                    onOpen={open}
                  />
                ) : location === "/predlosci" ? (
                  <Templates
                    key={user?.id ?? "guest"}
                    workspace={workspace}
                    persist={store.persist}
                    saving={store.isSaving}
                    onUse={setEditor}
                    requireLogin={requireLogin}
                  />
                ) : location === "/postavke" ? (
                  <Settings workspace={workspace} />
                ) : (
                  <>
                    {location === "/dogadaji" && (
                      <button
                        className="event-callout"
                        onClick={() => go("/predavanje")}
                      >
                        <span className="row-icon">
                          <CalendarDays size={24} />
                        </span>
                        <div>
                          <span className="eyebrow">
                            U PRIPREMI · 20–30 SUDIONIKA
                          </span>
                          <h3>{workspace.lecture.title}</h3>
                          <p>
                            Termin i prostor definiraju se u modulu pripreme.
                          </p>
                        </div>
                        <ArrowRight size={21} />
                      </button>
                    )}
                    {location === "/videozapisi" && <CuratedVideoShelf />}
                    <Library
                      key={`${location}-${topic}`}
                      records={workspace.records}
                      kind={kind}
                      search={search}
                      setSearch={setSearch}
                      onOpen={open}
                      onNew={newContent}
                      initialTopic={topic}
                    />
                  </>
                )}
              </>
            )
          )}
          <footer className="main-footer">
            <span>
              <span className="footer-dot" />
              MansAlpha · znanje s ljudskom perspektivom
            </span>
            <span>Edukativni prostor. Nije zamjena za stručnu pomoć.</span>
          </footer>
        </main>
      </div>
      {dialogs}
    </div>
  );
}
function LockSymbol() {
  return <ShieldCheck size={20} />;
}
