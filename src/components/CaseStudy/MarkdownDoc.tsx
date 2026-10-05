import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Lexer, type Token, type Tokens } from 'marked';
import { CASE_STUDIES, type CaseStudyId } from '../../data/caseStudies';
import { WrestlingDiagrams } from './WrestlingDiagrams';
import { CaseStudyMedia } from './CaseStudyMedia';
import { compileCaseStudy, type CaseBlock } from './markdown';
import styles from './MarkdownDoc.module.css';

function safeUrl(url: string) {
  return /^(https?:\/\/|mailto:|\/[^/]|#)/i.test(url) ? url : undefined;
}
function inline(tokens: Token[] = []): ReactNode {
  return tokens.map((token, i) => {
    const t = token as Tokens.Generic;
    switch (token.type) {
      case 'strong': return <strong key={i}>{inline(t.tokens)}</strong>;
      case 'em': return <em key={i}>{inline(t.tokens)}</em>;
      case 'del': return <del key={i}>{inline(t.tokens)}</del>;
      case 'codespan': return <code key={i}>{t.text}</code>;
      case 'br': return <br key={i} />;
      case 'link': return <a key={i} href={safeUrl(t.href)} target="_blank" rel="noreferrer">{inline(t.tokens)}</a>;
      case 'image': return <img key={i} src={safeUrl(t.href)} alt={t.text} loading="lazy" />;
      case 'html': return null;
      default: return <Fragment key={i}>{t.tokens ? inline(t.tokens) : t.text?.replaceAll('&nbsp;', '\u00a0').replaceAll('&amp;', '&')}</Fragment>;
    }
  });
}
function renderToken(token: Token): ReactNode {
  const t = token as Tokens.Generic;
  switch (token.type) {
    case 'paragraph': case 'text': return <p>{inline(t.tokens ?? Lexer.lexInline(t.text))}</p>;
    case 'blockquote': return <aside className={styles.status}>{(t.tokens ?? []).map((child: Token, i: number) => <Fragment key={i}>{renderToken(child)}</Fragment>)}</aside>;
    case 'list': {
      const Tag = t.ordered ? 'ol' : 'ul';
      return <Tag>{t.items.map((item: Tokens.ListItem, i: number) => <li key={i}>{item.tokens.map((child, n) => <Fragment key={n}>{renderToken(child)}</Fragment>)}</li>)}</Tag>;
    }
    case 'hr': return <hr />;
    case 'code': return <pre tabIndex={0} aria-label="Text diagram"><code>{t.text}</code></pre>;
    default: return null;
  }
}

export function MarkdownDoc({ caseStudyId, onOpenItem }: { caseStudyId: CaseStudyId; onOpenItem: (id: string) => void }) {
  const config = CASE_STUDIES[caseStudyId];
  const blocks = useMemo(() => compileCaseStudy(config), [config]);
  const renderBlock = (block: CaseBlock, i: number): ReactNode => {
    const { token, directive, role } = block;
    let content: ReactNode;
    let wide = false;
    if (directive) {
      wide = true;
      if (directive.layout === 'problem' || directive.layout === 'system' || directive.layout === 'development') {
        content = <WrestlingDiagrams kind={directive.layout} />;
      } else if (directive.layout === 'architecture') {
        content = <figure className={styles.architecture}><figcaption>Conceptual software layers</figcaption>{['Frontend', 'Application / API', 'Data', 'Integrations / services'].map((label, n) => <Fragment key={label}>{n > 0 && <span aria-hidden="true">↓</span>}<p>{label}</p></Fragment>)}<small>Illustrative relationships, not a verified implementation architecture.</small></figure>;
      } else {
        content = <div className={styles[directive.layout]}>
          {directive.layout === 'split' && <div className={styles.splitText}>{block.children?.map(renderBlock)}</div>}
          {directive.media.map(media => <CaseStudyMedia key={media.path} media={media} />)}
        </div>;
      }
    } else if (token?.type === 'heading') {
      const t = token as Tokens.Heading;
      const Tag = role === 'title' ? 'h1' : role === 'eyebrow' || role === 'subtitle' || role === 'statement' ? 'p' : 'h2';
      content = <Tag className={role ? styles[role] : undefined}>{inline(t.tokens)}</Tag>;
      wide = role === 'title' || role === 'statement';
    } else if (token?.type === 'paragraph') {
      const t = token as Tokens.Paragraph;
      const label = t.text.replaceAll('**', '').trim();
      if (config.links?.[label]) content = <p><a className={styles.projectLink} href={config.links[label]} target="_blank" rel="noreferrer">{label}</a></p>;
      else if (t.text.includes('`← PREVIOUS PROJECT`')) return null;
      else content = <p className={role === 'metadata' ? styles.metadata : undefined}>{inline(t.tokens)}</p>;
    } else content = token ? renderToken(token) : null;
    return <div key={i} className={`${styles.block} ${wide ? styles.wide : ''} ${directive ? styles.mediaBlock : ''} ${directive?.size ? styles[`media${directive.size}`] : ''} ${directive?.contentBlocks ? styles.hero : ''}`} style={{ '--block-gap': `${block.gap}px` } as CSSProperties}>{content}</div>;
  };
  const ids = Object.keys(CASE_STUDIES) as CaseStudyId[];
  const next = CASE_STUDIES[ids[(ids.indexOf(caseStudyId) + 1) % ids.length]];
  return <article className={`${styles.document} ${styles[config.artDirection]} ${caseStudyId === 'wrestling-octopi-case-study' ? styles.wrestling : ''}`}>
    <div className={styles.page}>{blocks.map(renderBlock)}
      <nav className={styles.navigation} aria-label="Project navigation"><button onClick={() => onOpenItem(next.id)} type="button">Next: {next.label.replace('.md', '')} <span aria-hidden="true">↗</span></button></nav>
    </div>
  </article>;
}
