import type { ConceptualDiagram } from '../../data/textBlocks';
import styles from './EditorialDoc.module.css';

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↓</span>;
const Primitive = () => <span className={styles.primitive}><i /></span>;
const Wrapper = () => <span className={styles.wrapper}><Primitive /><span className={styles.extension} /></span>;
const ProductComponent = () => <span className={styles.productComponent}><span className={styles.rule} /><Wrapper /><span className={styles.rule} /></span>;

export function ConceptDiagram({ diagram }: { diagram: ConceptualDiagram }) {
  if (diagram === 'perspective') return (
    <figure className={styles.diagram} aria-label="From an individual academic project to collaborative product development">
      <div className={styles.university}>
        <p className={styles.label}>University</p>
        <span className={styles.node}>Small project</span><Arrow />
        <p className={styles.annotation}>One person can understand<br />most of the system</p>
      </div>
      <span className={styles.longArrow} aria-hidden="true">↓</span>
      <div className={styles.enterprise}>
        <p className={styles.label}>SAP Graph</p>
        <span className={styles.node}>Product</span>
        <div className={styles.branches}>
          {['Design', 'Engineering', 'Product'].map(label => <span key={label}>{label}</span>)}
        </div>
        <span className={styles.node}>Shared system</span><Arrow />
        <span className={styles.label}>Release</span>
      </div>
      <figcaption>Simplified illustration of the shift from individual academic projects to collaborative product development at enterprise scale.</figcaption>
    </figure>
  );
  if (diagram === 'composition') return (
    <figure className={styles.diagram} aria-label="A primitive is extended by a wrapper, reused in a product component, and composed into an interface">
      <ol className={styles.layers}>
        {[
          { label: 'Fiori / UI5 primitive', meaning: 'Primitive', shape: <Primitive /> },
          { label: 'Wrapper', meaning: 'Extension', shape: <Wrapper /> },
          { label: 'Product component', meaning: 'Reusable component', shape: <ProductComponent /> },
          { label: 'Interface', meaning: 'Composition', shape: <span className={styles.interface}><span className={styles.interfaceBar} /><span className={styles.interfaceContent}><ProductComponent /><ProductComponent /></span></span> },
        ].map((layer, i) => <li key={layer.label}>
          <div className={styles.layerLabel}><span className={styles.label}>0{i + 1} / {layer.meaning}</span><p>{layer.label}</p></div>
          <div className={styles.layerShape} aria-hidden="true">{layer.shape}</div>
        </li>)}
      </ol>
      <figcaption>Conceptual component composition. Abstract shapes, not SAP Graph screens.</figcaption>
    </figure>
  );
  if (diagram === 'judgment') return (
    <figure className={`${styles.diagram} ${styles.judgment}`} aria-label="The tooltip interaction and the tradeoff in this specific case">
      <div className={styles.tooltipSketch}>
        <span className={styles.label}>Hover</span><span className={styles.node}>Button</span><Arrow /><span className={styles.tooltip}>Tooltip</span>
      </div>
      <div className={styles.comparison}>
        <div><p className={styles.label}>Internal approach</p><ol className={styles.chain}>
          {['existing system', 'additional workaround', 'additional complexity', 'still not the intended interaction'].map(t => <li key={t}>{t}</li>)}
        </ol></div>
        <span className={styles.versus}>vs.</span>
        <div><p className={styles.label}>Considered exception</p><ol className={styles.chain}>
          {['specific external solution', 'intended interaction'].map(t => <li key={t}>{t}</li>)}
        </ol></div>
      </div>
      <figcaption>A tradeoff in this interaction: the value of consistency weighed against the cost of preserving it.</figcaption>
    </figure>
  );
  return (
    <figure className={`${styles.diagram} ${styles.convergence}`} aria-label="Reusability, testing, feature toggles, maintainability, and collaboration together support software that can change">
      <ul>{['Reusability', 'Testing', 'Feature toggles', 'Maintainability', 'Collaboration'].map(t => <li key={t}><span>{t}</span></li>)}</ul>
      <span className={styles.convergeArrow} aria-hidden="true">→</span>
      <p className={styles.outcome}>Software that<br />can change</p>
    </figure>
  );
}
