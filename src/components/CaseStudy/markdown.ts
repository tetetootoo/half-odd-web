import { Lexer, type Token } from 'marked';
import type { CaseStudyConfig, LayoutDirective } from '../../data/caseStudies';

export interface CaseBlock {
  token?: Token;
  role?: 'eyebrow' | 'title' | 'subtitle' | 'metadata' | 'statement';
  directive?: LayoutDirective;
  children?: CaseBlock[];
  gap: number;
}

// Marked owns Markdown syntax. We only interpret the document's explicit
// comment directives and spacing hints after tokenization.
export function compileCaseStudy(config: CaseStudyConfig): CaseBlock[] {
  const blocks: CaseBlock[] = [];
  let gap = 20;
  let headingCount = 0;
  let metadata = false;
  for (const token of Lexer.lex(config.markdown)) {
    if (token.type === 'space') continue;
    if (token.type === 'html') {
      const directiveName = /^<!--\s*([A-Z_]+)/.exec(token.raw)?.[1];
      const directive = directiveName ? config.directives[directiveName] : undefined;
      if (directive) {
        const children: CaseBlock[] = [];
        if (directive.layout === 'split') {
          for (let n = 0; n < (directive.contentBlocks ?? directive.paragraphs ?? 0); n++) {
            if (!blocks.length || (!directive.contentBlocks && blocks.at(-1)?.token?.type !== 'paragraph')) break;
            children.unshift(blocks.pop()!);
          }
        }
        blocks.push({ directive, children, gap: 48 });
        gap = 48;
      } else if (/^(\s*<br\s*\/?\s*>)+\s*$/.test(token.raw)) {
        gap = Math.max(gap, Math.min((token.raw.match(/<br/g)?.length ?? 1) * 16, 80));
      }
      // Comments and arbitrary HTML never become visible content.
      continue;
    }
    let role: CaseBlock['role'];
    if (token.type === 'heading') {
      headingCount++;
      if (config.artDirection === 'system') role = headingCount === 1 ? 'eyebrow' : headingCount === 2 ? 'title' : token.depth === 1 ? 'statement' : undefined;
      else role = headingCount === 1 ? 'title' : headingCount === 2 ? 'subtitle' : token.depth === 1 ? 'statement' : undefined;
    }
    if (!metadata && token.type === 'paragraph' && headingCount === 2) { role = 'metadata'; metadata = true; }
    if (token.type === 'hr') gap = Math.min(Math.max(gap, 48), 64);
    blocks.push({ token, role, gap });
    gap = token.type === 'hr' ? 40 : 20;
  }
  return blocks;
}
