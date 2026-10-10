import { SapDiagram } from './SapDiagram';
import sapStyles from './SapDiagram.module.css';
import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { Lexer, type Token, type Tokens } from 'marked';
import { CASE_STUDIES, type CaseStudyId } from '../../data/caseStudies';
import { CaseStudyMedia } from './CaseStudyMedia';
import { compileCaseStudy, type CaseBlock } from './markdown';
import styles from './MarkdownDoc.module.css';
import textStyles from './MarkdownTextDoc.module.css';

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
    case 'heading': {
      const Tag = `h${Math.min(t.depth, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag>{inline(t.tokens)}</Tag>;
    }
    case 'paragraph': case 'text': return <p>{inline(t.tokens ?? Lexer.lexInline(t.text))}</p>;
    case 'blockquote': return <aside className={styles.status}>{(t.tokens ?? []).map((child: Token, i: number) => <Fragment key={i}>{renderToken(child)}</Fragment>)}</aside>;
    case 'list': {
      const Tag = t.ordered ? 'ol' : 'ul';
      return <Tag>{t.items.map((item: Tokens.ListItem, i: number) => <li key={i}>{item.tokens.map((child, n) => <Fragment key={n}>{renderToken(child)}</Fragment>)}</li>)}</Tag>;
    }
    case 'table': {
      const table = token as Tokens.Table;
      return <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Scrollable table">
        <table className={styles.table}>
          <thead><tr>{table.header.map((cell, i) => <th key={i} scope="col" style={{ textAlign: table.align[i] ?? 'left' }}>{inline(cell.tokens)}</th>)}</tr></thead>
          <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} style={{ textAlign: table.align[j] ?? 'left' }}>{inline(cell.tokens)}</td>)}</tr>)}</tbody>
        </table>
      </div>;
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
      if (directive.layout.startsWith('sap-')) {
        content = <SapDiagram kind={directive.layout} />;
      } else if (directive.layout === 'overview') {
        content = <dl className={styles.overview} aria-label="Project overview">
          {block.children?.map((child, index) => {
            const text = (child.token as Tokens.Paragraph).text;
            const [label, ...value] = text.split('\n');
            return <div key={index}><dt>{label.replaceAll('**', '').trim()}</dt><dd>{inline(Lexer.lexInline(value.join('\n')))}</dd></div>;
          })}
        </dl>;
      } else if (directive.layout === 'intro') {
        content = <div className={styles.intro}>
          <div className={styles.introTitle}>{block.children?.slice(0, 1).map(renderBlock)}</div>
          <div className={styles.introDetails}>{block.children?.slice(1, -1).map(renderBlock)}</div>
          <div className={styles.introStatus}>{block.children?.slice(-1).map(renderBlock)}</div>
          <div className={styles.introVideo}>{directive.media.map(media => <CaseStudyMedia key={media.path} media={media} />)}</div>
        </div>;
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
      const headingClass = caseStudyId === 'sap-graph-case-study' && t.text === 'FROM UNIVERSITY → SAP GRAPH' ? styles.universitySapHeading : role ? styles[role] : undefined;
      content = <Tag className={headingClass}>{inline(t.tokens)}</Tag>;
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
  return <article className={`${styles.document} ${styles[config.artDirection]} ${caseStudyId === 'sap-graph-case-study' ? sapStyles.caseStudy : ''} ${caseStudyId === 'wrestling-octopi-case-study' ? styles.wrestling : ''}`}>
    <div className={styles.page}>{blocks.map(renderBlock)}
      <nav className={styles.navigation} aria-label="Project navigation"><button onClick={() => onOpenItem(next.id)} type="button">Next: {next.label.replace('.md', '')} <span aria-hidden="true">↗</span></button></nav>
    </div>
  </article>;
}

export function MarkdownTextDoc({ markdown }: { markdown: string }) {
  const tokens = useMemo(() => Lexer.lex(markdown).filter(token => token.type !== 'space'), [markdown]);
  return <article className={`${styles.document} ${textStyles.document}`}>
    <div className={`${styles.page} ${textStyles.page}`}>{tokens.map((token, i) => <Fragment key={i}>{renderToken(token)}</Fragment>)}</div>
  </article>;
}

export function MarkdownInline({ tokens }: { tokens: Token[] }) {
  return <>{inline(tokens)}</>;
}
