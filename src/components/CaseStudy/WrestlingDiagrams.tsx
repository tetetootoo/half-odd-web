import styles from './WrestlingDiagrams.module.css';

const layers = [
  { label: 'Frontend', technologies: 'React · TypeScript · Vite', detail: 'The product interface' },
  { label: 'Application / API', technologies: 'Node.js · Express · TypeScript', detail: 'Product logic and integrations' },
];
const infrastructure = [
  ['PostgreSQL', 'Primary data'], ['Prisma', 'Data access'], ['Redis', 'Cache and queues'], ['BullMQ', 'Background jobs'],
];
const integrations = [
  ['Meta APIs', 'Connected channels'], ['Anthropic Claude', 'Caption assistance'], ['Cloudinary', 'Media storage'],
  ['Canva', 'Design and export'], ['Stripe', 'Billing'], ['Resend', 'Transactional email'],
];
const steps = [
  ['Product decision', 'Identify a problem or opportunity.'],
  ['Design / spec', 'Define the solution, flow, behavior, and UI.'],
  ['AI-assisted implementation', 'Generate and implement code with AI assistance.'],
  ['Manual testing', 'Test the actual product behavior.'],
  ['Catch issues', '“Technically works” but the behavior is not right.'],
  ['Debug / challenge', 'Reproduce the issue, challenge assumptions, inspect the implementation.'],
  ['Refine and improve', 'Adjust, test again, and integrate.'],
];

export function WrestlingDiagrams({ kind }: { kind: 'problem' | 'system' | 'development' }) {
  if (kind === 'problem') return <figure className={styles.diagram} aria-label="Fragmented social-content workflow">
    <figcaption className={styles.eyebrow}>A fragmented workflow</figcaption>
    <ol className={styles.fragmented}>{['Planning', 'Creating', 'Scheduling', 'Publishing', 'Managing'].map((label) => <li key={label}>{label}</li>)}</ol>
    <p className={styles.note}>One workflow, disconnected tools.</p>
  </figure>;
  if (kind === 'system') return <figure className={styles.diagram} aria-label="Wrestling Octopi implementation architecture">
    <figcaption className={styles.eyebrow}>Under the interface</figcaption>
    <ol className={styles.layers}>
      {layers.map((layer) => <li key={layer.label}>
        <span className={styles.eyebrow}>{layer.label}</span><p>{layer.technologies}</p><small>{layer.detail}</small>
      </li>)}
      <li><span className={styles.eyebrow}>Data / infrastructure</span><dl className={styles.infrastructure}>{infrastructure.map(([name, purpose]) => <div key={name}><dt>{name}</dt><dd>{purpose}</dd></div>)}</dl></li>
    </ol>
    <div className={styles.services}><p className={styles.eyebrow}>Integrations / services</p><dl>{integrations.map(([name, purpose]) => <div key={name}><dt>{name}</dt><dd>{purpose}</dd></div>)}</dl></div>
  </figure>;
  return <figure className={styles.diagram} aria-label="AI-assisted development with human testing and iteration">
    <figcaption className={styles.eyebrow}>AI-assisted development</figcaption>
    <ol className={styles.process}>{steps.map(([label, description], index) => <li key={label}>
      <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div><p>{label}</p><small>{description}</small></div>
    </li>)}</ol>
    <p className={styles.iteration}><span aria-hidden="true">↺</span> Back into iteration</p>
    <p className={styles.partner}>AI as a partner, not an autopilot.</p>
  </figure>;
}
