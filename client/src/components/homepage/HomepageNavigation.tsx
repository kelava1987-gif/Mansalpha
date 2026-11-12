import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
interface Props {
  onNavigate: (path: string) => void;
  onSearch: (query: string) => void;
  internalPage?: boolean;
}
const LINKS = [
  { label: "Područja", href: "#podrucja" },
  { label: "Članci", href: "#istrazivanja" },
  { label: "Multimedija", href: "#multimedija" },
  { label: "Naša vizija", href: "#vizija" },
  { label: "O autoru", href: "#autor" },
];
export function localNavigation(
  event: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  onNavigate: (path: string) => void
) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  onNavigate(href);
}
export default function HomepageNavigation({
  onNavigate,
  onSearch,
  internalPage = false,
}: Props) {
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (searching) input.current?.focus();
  }, [searching]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        setSearching(false);
        menuButton.current?.focus();
      }
      if (
        !internalPage &&
        (event.metaKey || event.ctrlKey) &&
        event.key === "k"
      ) {
        event.preventDefault();
        setSearching(true);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [internalPage]);
  function closeMenu() {
    setMenu(false);
  }
  return (
    <header className="mh-navigation">
      <div className="mh-nav-inner">
        <a
          className="mh-brand"
          href="/"
          aria-label="MansAlpha naslovnica"
          onClick={e => localNavigation(e, "/", onNavigate)}
        >
          <img src="/logo.svg" width="34" height="34" alt="" />
          <span>
            MansAlpha<span className="mh-brand-point">.</span>
          </span>
        </a>
        <nav
          className="mh-desktop-nav"
          aria-label="Glavna navigacija naslovnice"
        >
          {LINKS.map(link => (
            <a
              href={internalPage ? `/${link.href}` : link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mh-nav-actions">
          <button
            className="mh-icon-button"
            onClick={() => setSearching(!searching)}
            aria-label={searching ? "Zatvori pretragu" : "Pretraži sadržaj"}
            aria-expanded={searching}
          >
            <Search size={19} />
          </button>
          <a
            className="mh-workspace-link"
            href="/pregled"
            onClick={e => localNavigation(e, "/pregled", onNavigate)}
          >
            Radni prostor
            <ArrowUpRight size={15} />
          </a>
          <button
            ref={menuButton}
            className="mh-icon-button mh-menu-button"
            aria-label={menu ? "Zatvori izbornik" : "Otvori izbornik"}
            aria-expanded={menu}
            aria-controls="mh-mobile-navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {searching && (
        <form
          className="mh-search-form"
          role="search"
          onSubmit={e => {
            e.preventDefault();
            if (query.trim()) {
              onSearch(query.trim());
              setSearching(false);
            }
          }}
        >
          <label className="sr-only" htmlFor="mh-search">
            Pretraži MansAlpha
          </label>
          <Search size={20} />
          <input
            ref={input}
            id="mh-search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Pretražite članke, teme i materijale…"
            autoComplete="off"
          />
          <button type="submit">
            Pretraži
            <ArrowUpRight size={16} />
          </button>
          <button
            type="button"
            className="mh-icon-button"
            aria-label="Zatvori pretragu"
            onClick={() => setSearching(false)}
          >
            <X size={18} />
          </button>
        </form>
      )}
      {menu && (
        <nav
          id="mh-mobile-navigation"
          className="mh-mobile-nav"
          aria-label="Mobilna navigacija naslovnice"
        >
          {LINKS.map(link => (
            <a
              key={link.href}
              href={internalPage ? `/${link.href}` : link.href}
              onClick={closeMenu}
            >
              {link.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
          <a
            href="/knjiznica"
            onClick={e => {
              closeMenu();
              localNavigation(e, "/knjiznica", onNavigate);
            }}
          >
            Knjižnica sadržaja
            <ArrowUpRight size={18} />
          </a>
          <a
            href="/pregled"
            onClick={e => {
              closeMenu();
              localNavigation(e, "/pregled", onNavigate);
            }}
          >
            Urednički radni prostor
            <ArrowUpRight size={18} />
          </a>
        </nav>
      )}
    </header>
  );
}
