import { useEffect, useRef, useState } from 'react';
import { marked, Lexer, type Tokens } from 'marked';
import content from '../../data/fitz-proposal.md?raw';
import windowStyles from '../Window/Window.module.css';
import { MenuBar } from '../MenuBar/MenuBar';
import './FitzProposal.css';

const phaseNames = ['Konzept & Struktur', 'Designrichtung', 'Entwicklung', 'Feedback & Tests', 'Livegang & Übergabe'];
const sections = content.split(/^## /m);
const html = (value: string) => ({ __html: marked.parse(value, { async: false }) as string });

const navigation = [
  ['proposal', 'Überblick'],
  ['umfang', 'Basispaket'],
  ['erweiterungen', 'Erweiterungen'],
  ['zeitplan', 'Zeitplan'],
  ['honorar', 'Honorar'],
];

export default function FitzProposal() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('proposal');
  const navigationTarget = useRef<string | null>(null);
  const navigateToSection = (id: string) => {
    navigationTarget.current = id;
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ block: 'start' });
  };
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const updateSection = () => {
      if (navigationTarget.current) return;
      const threshold = root.getBoundingClientRect().top + 90;
      let current = 'proposal';
      for (const [id] of navigation) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = id;
      }
      if (root.scrollHeight - root.scrollTop - root.clientHeight < 4) current = 'honorar';
      setActiveSection(current);
    };
    const finishNavigation = () => {
      clearTimeout(settleTimer);
      navigationTarget.current = null;
      updateSection();
    };
    const onScroll = () => {
      updateSection();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(finishNavigation, 180);
    };
    const interruptNavigation = () => { navigationTarget.current = null; };
    root.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('scrollend', finishNavigation);
    root.addEventListener('wheel', interruptNavigation, { passive: true });
    root.addEventListener('touchstart', interruptNavigation, { passive: true });
    root.addEventListener('keydown', interruptNavigation);
    updateSection();
    return () => {
      clearTimeout(settleTimer);
      root.removeEventListener('scroll', onScroll);
      root.removeEventListener('scrollend', finishNavigation);
      root.removeEventListener('wheel', interruptNavigation);
      root.removeEventListener('touchstart', interruptNavigation);
      root.removeEventListener('keydown', interruptNavigation);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.add('fitz-document');
    const previousTitle = document.title;
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = 'de';
    document.title = 'FITZ Sports Club — Website Proposal · half odd';
    return () => { document.documentElement.classList.remove('fitz-document'); document.title = previousTitle; document.documentElement.lang = previousLang; };
  }, []);
  const intro = sections[0].split('\n\n').slice(2).join('\n\n');
  return (
    <div className="fitz">
      <div className="fitz-desktop-menu"><MenuBar /></div>
      <div className="fitz-workspace">
      <div className="fitz-window">
      <div className="fitz-chrome">
      <a className="fitz-skip" href="#proposal">Zum Inhalt</a>
      <header className={`${windowStyles.titleBar} ${windowStyles.titleBarText} fitz-titlebar`}>
        <div className={windowStyles.trafficLights}>
          <a href="https://halfodd.com" className={`${windowStyles.light} ${windowStyles.red}`} aria-label="Dokument schließen und halfodd.com öffnen">
            <svg className={windowStyles.lightIcon} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true"><path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="#4d0000" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </a>
          <span className={`${windowStyles.light} ${windowStyles.yellow}`} aria-hidden="true" />
          <span className={`${windowStyles.light} ${windowStyles.green}`} aria-hidden="true" />
        </div>
        <span className={windowStyles.fileName}>fitz-sports-club-proposal.md</span>
        <a className="fitz-close" href="https://halfodd.com">schließen ↗</a>
      </header>
      </div>
      <header className="fitz-mobile-header">
        <span>fitz-proposal.md</span>
        <a href="https://halfodd.com" aria-label="Proposal schließen und halfodd.com öffnen"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></a>
      </header>
      <nav className="fitz-mobile-sections" aria-label="Proposal-Abschnitte mobil">
        {navigation.filter(([id]) => id !== 'honorar').map(([id, label]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); navigateToSection(id); }} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}
      </nav>
      <div className="fitz-document-body">
      <nav className="fitz-section-nav" aria-label="Proposal-Abschnitte">
        {navigation.map(([id, label], index) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); navigateToSection(id); }} aria-current={activeSection === id ? 'location' : undefined}><span>{String(index + 1).padStart(2, '0')}</span>{label}</a>)}
      </nav>
      <div className="fitz-document-scroll" ref={scrollRef}>
      <main id="proposal">
        <section className="fitz-hero">
          <div className="fitz-eyebrow"><img className="fitz-club-logo" src="/media/fitz/logo.svg" alt="FITZ Sports Club" /><span className="fitz-date-desktop">04. NOVEMBER 2026</span></div>
          <h1>{sections[0].split("\n")[0].replace(/^# /, "")}</h1>
          <div className="fitz-hero-bottom"><p>Angebot von Theresa Schantz · half odd</p><p className="fitz-date-mobile">04. November 2026</p></div>
        </section>
        <section className="fitz-intro fitz-copy"><span className="fitz-label">DIE IDEE</span><div dangerouslySetInnerHTML={html(intro)} /></section>
        {sections.slice(1).map((section, i) => {
          const newline = section.indexOf('\n');
          const title = section.slice(0, newline);
          const body = section.slice(newline + 1);
          const timeline = i === 2;
          const timelineTable = timeline ? Lexer.lex(body).find((token): token is Tokens.Table => token.type === 'table') : undefined;
          const tableStart = timelineTable ? body.indexOf(timelineTable.raw) : -1;
          const phases = timelineTable?.rows.map((row, index) => [row[0].text.replaceAll('**', ''), phaseNames[index], row[1].text]) ?? [];
          const beforeTimeline = tableStart >= 0 ? body.slice(0, tableStart) : '';
          const afterTimeline = timelineTable ? body.slice(tableStart + timelineTable.raw.length) : body;
          return <section className={`fitz-section ${timeline ? 'fitz-schedule' : ''}`} id={['umfang', 'erweiterungen', 'zeitplan', 'honorar'][i]} key={title}>
            <div className="fitz-section-head"><div><span className="fitz-label">{['LEISTUNGSUMFANG', 'MEHR MÖGLICHKEITEN', 'GEMEINSAM ZUM LAUNCH', 'DIE RAHMENBEDINGUNGEN'][i]}</span><h2>{title}</h2></div><span className="fitz-number">0{i + 1}/</span></div>
            {timeline ? <><div className="fitz-copy" dangerouslySetInnerHTML={html(beforeTimeline)} /><div className="fitz-timeline" aria-label="Projektzeitplan vom 9. November bis 15. Dezember 2026"><div className="fitz-grid" />{phases.map(([date, name, description], index) => <a href={`#phase-${index}`} className={`fitz-bar fitz-bar-${index}`} key={date}><span>{name}</span><small>{date}</small><span className="fitz-timeline-description" dangerouslySetInnerHTML={html(description)} /></a>)}<div className="fitz-axis"><span>09. NOV</span><span>16. NOV</span><span>23. NOV</span><span>30. NOV</span><span>07. DEZ</span><span>15. DEZ ↗</span></div></div><div className="fitz-phases">{phases.map(([date, name, description], index) => <article id={`phase-${index}`} key={date}><span>{date}</span><h3>{name}</h3><div dangerouslySetInnerHTML={html(description)} /></article>)}</div><div className="fitz-copy" dangerouslySetInnerHTML={html(afterTimeline)} /></> : <div className="fitz-copy" dangerouslySetInnerHTML={html(body)} />}
          </section>;
        })}
      <div className="fitz-download"><a href="/downloads/fitz-angebot.pdf" download="FITZ-Angebot-half-odd.pdf">Angebot als PDF herunterladen  ↓</a></div>
      </main>
      <footer className="fitz-footer"><span>FITZ × half odd</span><a href="https://halfodd.com">halfodd.com ↗</a><span>Konzept · Design · Entwicklung</span></footer>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}
