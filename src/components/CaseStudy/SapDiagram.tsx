import styles from './SapDiagram.module.css';
const Arrow = () => <span className={styles.arrow} aria-hidden="true">↓</span>;
const Node = ({ children }: { children: string }) => <div className={styles.node}>{children}</div>;
export function SapDiagram({ kind }: { kind: string }) {
  if (kind === 'sap-evolution') return <figure className={styles.timeline} aria-label="Product evolution after my contribution">
    <div className={styles.timelineRow}>
      <div className={styles.timelineState}><p className={styles.date}>2020-21</p><p className={`${styles.product} ${styles.productOrigin}`}><span>sap graph</span><span className={styles.timelineConnector} aria-hidden="true" /></p><p className={styles.status}>early access</p><small>my contribution</small></div>
      <div className={styles.timelineState}><p className={styles.date}>today</p><p className={styles.product}>graph / api composition</p><p className={styles.status}>generally available</p><small>sap integration suite</small></div>
    </div>
  </figure>;
  const exception = kind === 'sap-exception';
  const graph = kind === 'sap-graph';
  const title = exception ? 'considered exception' : graph ? 'one graph instead of fragmented systems' : 'software that can change';
  return <figure className={`${styles.diagram} ${kind === 'sap-reuse' ? styles.reuse : ''}`} aria-label={title}>
    <h3>{title}</h3>
    {exception ? <>
      <div className={styles.interaction}>
        <div><Node>button</Node><p>user hovers over a button</p></div>
        <div className={styles.hover}><span>hover</span><span className={styles.horizontalArrow} aria-hidden="true">→</span></div>
        <div><Node>tooltip</Node><p>additional information appears</p></div>
      </div>
      <p className={styles.support}>external library supports the intended interaction</p>
      <small>a local tradeoff, assessed together with a mentor</small>
    </> : <>
      <div className={styles.flow}>
        <Node>{graph ? 'application' : 'shared pattern'}</Node><Arrow />
        <Node>{graph ? 'unified semantic api' : 'reusable component'}</Node><Arrow />
        {graph && <><Node>business data graph</Node><Arrow /></>}
        <div className={styles.branches}>{[0, 1, 2].map(i => <Node key={i}>{graph ? 'system' : 'context'}</Node>)}</div>
      </div>
      <p className={styles.support}>{graph ? 'one connected layer between the application and underlying systems' : 'reusable components create room for the product to evolve'}</p>
    </>}
  </figure>;
}
