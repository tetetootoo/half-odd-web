import type { TextBlock } from './textBlocks';

// Shared between mobile and desktop so the "working at SAP.txt" overlay
// reads identically on both platforms.
//
// Deliberately restrained compared to the Wrestling Octopi case study:
// typography, native HTML/CSS diagrams, and whitespace as the visual
// language rather than product screenshots — SAP Graph's UI is
// proprietary, so nothing here recreates or implies it. See
// src/data/textBlocks.ts for the diagram primitives (flowDiagram,
// flowComparison, layerDiagram, narrow, escalatingStatement).
export const WORKING_AT_SAP: TextBlock[] = [
  // ---- 1. Hero ----
  { eyebrow: 'SAP Graph' },
  'Where I learned the difference between writing code and engineering software.',
  'Front-End Engineering · Design Systems · SAP',
  'I arrived at SAP with a foundation in computer science and practical programming. At university, I had built games, worked on a virtual machine, and learned to think about code through projects I could largely understand from end to end.',
  'SAP Graph was different.',
  'For the first time, I was contributing to a production system larger than anything I could hold in my head, built simultaneously by engineers, designers, and product teams across a large organisation.',
  '**University taught me how to write software.\nSAP taught me how software gets built together.**',

  // ---- 2. From university to SAP Graph ----
  {
    flowDiagram: {
      lines: [
        { text: 'UNIVERSITY' },
        { nodes: ['Small project'] },
        { connector: '↓' },
        { text: 'One person can understand most or all of the system' },
        { connector: '↓' },
        { text: 'SAP GRAPH' },
        { nodes: ['SAP Graph'] },
        { connector: '↙ ↓ ↘' },
        { nodes: ['Design', 'Engineering', 'Product'] },
        { connector: '↘ ↓ ↙' },
        { nodes: ['Shared system'] },
        { connector: '↓' },
        { nodes: ['Release'], emphasize: true },
      ],
      caption:
        'Simplified illustration of the shift from individual academic projects to collaborative product development at enterprise scale.',
    },
  },

  // ---- 3. Designing inside a system ----
  '## Designing inside a system',
  "Working with SAP's Fiori/UI5 ecosystem changed how I understood design systems.",
  'I translated product designs into React and TypeScript interfaces, worked with existing components, built wrappers where additional behaviour was needed, and contributed reusable components as the product evolved.',
  { layerDiagram: ['Fiori / UI5 primitive', 'Wrapper', 'Product component', 'Interface'] },
  {
    escalatingStatement: {
      first: 'How do I build this?',
      second: "What should remain reusable after I've built this?",
    },
  },
  'A design system stopped being a collection of consistent-looking components.',
  '**It became shared infrastructure between design and engineering.**',

  // ---- 4. The tooltip story ----
  "## When the system isn't the answer",
  {
    narrow: [
      'One tiny tooltip taught me one of my most lasting engineering lessons.',
      "We needed an interaction that our existing components couldn't reproduce cleanly. I spent hours trying to keep the solution within our internal ecosystem before arguing that an external library was the better approach.",
      'My mentor disagreed.',
      'We eventually sat down and tried solving it together. After encountering the same limitations, we made the exception.',
      "What stayed with me wasn't being right.",
      "It was understanding that engineering principles aren't rules to follow mechanically.",
    ],
  },
  '**Consistency matters.\nSo does knowing when the cost of preserving it exceeds its value.**',
  {
    flowDiagram: {
      lines: [{ nodes: ['Button'] }, { connector: '↓ hover' }, { nodes: ['Tooltip'] }],
    },
  },
  {
    flowComparison: {
      left: {
        lines: [
          { text: 'INTERNAL APPROACH' },
          { nodes: ['Increasing complexity'] },
          { connector: '↓' },
          { nodes: ['Increasing complexity'] },
          { connector: '↓' },
          { nodes: ['Increasing complexity'] },
        ],
      },
      right: {
        lines: [
          { text: 'CONSIDERED EXCEPTION' },
          { nodes: ['External solution'] },
          { connector: '↓' },
          { nodes: ['Intended interaction'], emphasize: true },
        ],
      },
    },
  },

  // ---- 5. What stayed with me ----
  '## What stayed with me',
  'SAP taught me to think beyond whether my code worked today: reusable components, automated testing, feature toggles, maintainability, collaboration, and the people who would have to understand the system after me.',
  {
    flowDiagram: {
      lines: [
        { nodes: ['Reusability', 'Testing', 'Feature toggles', 'Maintainability', 'Collaboration'] },
        { connector: '↓' },
        { nodes: ['Software that can change'], emphasize: true },
      ],
    },
  },

  // ---- 6. Final statement ----
  '',
  '**I entered knowing how to program.\nI left understanding how software survives change.**',
];
