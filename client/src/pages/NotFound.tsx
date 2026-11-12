import { ArrowUpRight, Compass } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import HomepageNavigation, {
  localNavigation,
} from "@/components/homepage/HomepageNavigation";

const NOT_FOUND_PATH = "/404";
export default function NotFound() {
  const [, navigate] = useLocation();
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
    document.title = "Stranica nije pronađena · MansAlpha";
    if (window.location.pathname.replace(/\/$/, "") !== NOT_FOUND_PATH) {
      window.location.replace(NOT_FOUND_PATH);
    }
    return () => robots.remove();
  }, []);
  return (
    <div className="mh-page">
      <HomepageNavigation
        internalPage
        onNavigate={navigate}
        onSearch={q => navigate(`/knjiznica?q=${encodeURIComponent(q)}`)}
      />
      <main className="mh-section mh-not-found">
        <p className="mh-eyebrow">MANSALPHA / IZVAN PUTANJE</p>
        <div className="mh-not-found-number" aria-hidden="true">
          404
        </div>
        <Compass size={34} strokeWidth={1.2} />
        <h1>
          Ova perspektiva
          <br />
          <em>još nema stranicu.</em>
        </h1>
        <p>
          Tražena stranica nije pronađena. Vratite se naslovnici ili nastavite
          istraživati knjižnicu.
        </p>
        <div id="not-found-button-group">
          <a
            className="mh-button mh-button-primary"
            href="/"
            onClick={e => localNavigation(e, "/", navigate)}
          >
            Na naslovnicu
            <ArrowUpRight size={18} />
          </a>
          <a
            className="mh-button mh-button-outline"
            href="/knjiznica"
            onClick={e => localNavigation(e, "/knjiznica", navigate)}
          >
            Otvori knjižnicu
            <ArrowUpRight size={18} />
          </a>
        </div>
      </main>
    </div>
  );
}
