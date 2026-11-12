import React from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Microscope,
  Orbit,
  Brain,
  ShieldCheck,
} from "lucide-react";
import {
  AUTHOR_PROFILE,
  AUTHOR_ASSERTIONS,
  HERMETIC_PRINCIPLE,
  MANSALPHA_MOTTO,
  RESEARCH_FRAMEWORK,
} from "../../../../shared/platform";
import { localNavigation } from "./HomepageNavigation";

const FRAMEWORK_ICONS = [Brain, Orbit, Microscope, ShieldCheck];

export function ResearchFramework({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  return (
    <section className="mh-framework-wrap" id="o-mansalpha">
      <div className="mh-section mh-framework" data-mh-reveal>
        <div className="mh-section-heading">
          <div>
            <p className="mh-eyebrow">MANSALPHA / ISTRAŽIVAČKI OKVIR</p>
            <h2>
              Razumjeti dublje.
              <br />
              <em>Propitivati otvoreno.</em>
            </h2>
          </div>
          <p>
            Četiri temeljna područja povezuju naš pogled na psihu. Metodološka
            preciznost i znatiželja ne isključuju jedna drugu.
          </p>
        </div>
        <div className="mh-framework-grid">
          {RESEARCH_FRAMEWORK.map((area, index) => {
            const Icon = FRAMEWORK_ICONS[index];
            return (
              <article className="mh-framework-card" key={area.id}>
                <div className="mh-framework-top">
                  <span>{area.number} /</span>
                  <Icon size={26} strokeWidth={1.25} />
                </div>
                <p className="mh-eyebrow">{area.subtitle}</p>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <details className="mh-framework-detail">
                  <summary>
                    Metode i granice <ChevronDown size={16} />
                  </summary>
                  <p>{area.detail}</p>
                </details>
                <p className="mh-framework-note">{area.note}</p>
                <a
                  href={area.path}
                  onClick={e => localNavigation(e, area.path, onNavigate)}
                  className="mh-small-link"
                >
                  {area.linkLabel}
                  <ArrowUpRight size={16} />
                </a>
              </article>
            );
          })}
        </div>
        <div className="mh-method-line">
          <div>
            <span className="mh-eyebrow">NAŠ ISTRAŽIVAČKI STAV</span>
            <p>{MANSALPHA_MOTTO}</p>
          </div>
          <div>
            <blockquote>„{HERMETIC_PRINCIPLE}”</blockquote>
            <p>
              Hermetički princip kao filozofski motiv — ne zamjena za znanstveni
              dokaz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AuthorSection({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  return (
    <section
      className="mh-section mh-author"
      id="autor"
      data-mh-reveal
      aria-labelledby="mh-author-name"
    >
      <figure className="mh-author-portrait">
        <img
          src={AUTHOR_PROFILE.imageUrl}
          alt={`Portret autora ${AUTHOR_PROFILE.name}`}
          width="1080"
          height="1493"
          loading="lazy"
        />
        <figcaption>
          <span>MANSALPHA / AUTOR</span>
          <span>ČOVJEK IZA PERSPEKTIVE</span>
        </figcaption>
      </figure>
      <div className="mh-author-copy">
        <p className="mh-eyebrow">O AUTORU</p>
        <h2 id="mh-author-name">
          Luka
          <br />
          <em>Anić-Antić.</em>
        </h2>
        <p className="mh-author-role">{AUTHOR_PROFILE.role}</p>
        <p className="mh-author-intro">{AUTHOR_PROFILE.biography}</p>
        <div className="mh-author-bio-block">
          <span className="mh-eyebrow">PROFESIONALNA POZADINA</span>
          <p>{AUTHOR_PROFILE.background}</p>
        </div>
        <div className="mh-author-bio-block">
          <span className="mh-eyebrow">ISTRAŽIVAČKI FOKUS</span>
          <p>{AUTHOR_PROFILE.focus}</p>
        </div>
        <div className="mh-author-tags">
          <span>Bihevioralna analiza</span>
          <span>Forenzička psihologija</span>
          <span>Psihofarmakologija</span>
        </div>
        <details className="mh-author-assertions">
          <summary>
            Autorski navodi o iskustvu i radovima <ChevronDown size={16} />
          </summary>
          <p>{AUTHOR_ASSERTIONS.text}</p>
          <p className="mh-author-assertions-note">{AUTHOR_ASSERTIONS.note}</p>
        </details>
        <a
          href="/clanci"
          className="mh-inline-link"
          onClick={e => localNavigation(e, "/clanci", onNavigate)}
        >
          Istraži tekstove i perspektive
          <ArrowUpRight size={17} />
        </a>
        <p className="mh-author-source">{AUTHOR_PROFILE.sourceNote}</p>
      </div>
    </section>
  );
}
