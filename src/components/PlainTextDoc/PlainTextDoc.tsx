import styles from './PlainTextDoc.module.css';

export function PlainTextDoc({ lines }: { lines: string[] }) {
  return <pre className={styles.document}><strong>{lines[0]}</strong>{lines.length > 1 ? `\n${lines.slice(1).join('\n')}` : ''}</pre>;
}
