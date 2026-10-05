import { Fragment, useMemo } from 'react';
import { Lexer, type Token, type Tokens } from 'marked';
import { MarkdownInline } from './MarkdownDoc';

function inline(tokens: Token[] = []) { return <MarkdownInline tokens={tokens} />; }
import styles from './CvDoc.module.css';

function content(token: Token) {
  if (token.type === 'paragraph' || token.type === 'heading' || token.type === 'text') return inline((token as Tokens.Paragraph).tokens);
  return null;
}
function groups(tokens: Token[]) {
  const rows: Token[][] = [];
  for (const token of tokens) {
    if (token.type === 'heading') rows.push([]);
    rows.at(-1)?.push(token);
  }
  return rows;
}
function splitLines(token: Token) {
  const parts: Token[][] = [[]];
  for (const t of (token as Tokens.Paragraph).tokens) {
    if (t.type === 'br') parts.push([]);
    else parts.at(-1)!.push(t);
  }
  return parts;
}
export function CvDoc({ markdown }: { markdown: string }) {
  const tokens = useMemo(() => Lexer.lex(markdown.replace(/ · /g, '\u00a0· ')).filter(t => t.type !== 'space' && t.type !== 'hr'), [markdown]);
  const start = tokens.findIndex(t => t.type === 'heading' && (t as Tokens.Heading).depth === 2);
  const sections: { title: Token; tokens: Token[] }[] = [];
  for (const t of tokens.slice(start)) {
    if (t.type === 'heading' && (t as Tokens.Heading).depth === 2) sections.push({ title: t, tokens: [] });
    else sections.at(-1)?.tokens.push(t);
  }
  return <article className={styles.document} aria-label="Curriculum vitae"><div className={styles.page}>
    <header className={styles.header}>
      <div><h1>{content(tokens[0])}</h1><p className={styles.subtitle}>{content(tokens[1])}</p></div>
      <div className={styles.contacts}>{content(tokens[2])}</div>
    </header>
    {sections.map((section, i) => <section key={i} className={styles.section}>
      <h2>{content(section.title)}</h2>
      {i === 3 ? <div className={styles.skills}>{section.tokens.map((token, n) => {
        const [label, ...rest] = splitLines(token);
        return <div className={styles.skillRow} key={n}><div>{inline(label)}</div><div>{rest.map((line, j) => <Fragment key={j}>{inline(line)}</Fragment>)}</div></div>;
      })}</div> : groups(section.tokens).map((row, n) => {
        if (i === 1) return <div className={styles.projectRow} key={n}><h3>{content(row[0])}</h3><div className={styles.disciplines}>{content(row[1])}</div><p>{content(row[2])}</p></div>;
        if (i === 2) {
          const [degree, year] = splitLines(row[1]);
          return <div className={styles.educationRow} key={n}><h3>{content(row[0])}</h3><div className={styles.degree}>{inline(degree)}</div><div className={styles.year}>{inline(year)}</div></div>;
        }
        const [role, dates] = splitLines(row[1]);
        return <div className={styles.role} key={n}><h3>{content(row[0])}<span className={styles.roleTitle}>{inline(role)}</span></h3><p className={styles.metadata}>{inline(dates)}</p><ul>{row.slice(2).flatMap(t => t.type === 'list' ? (t as Tokens.List).items : []).map((item, j) => <li key={j}>{item.tokens.map((t, k) => <Fragment key={k}>{content(t)}</Fragment>)}</li>)}</ul></div>;
      })}
    </section>)}
  </div></article>;
}
