/**
 * 编译 src/articles/ 下的 markdown 为 src/generated/articles.ts。
 *
 * - frontmatter 用 gray-matter 解析
 * - 正文用 marked 转 HTML，允许 raw HTML 直通
 * - 本地图片 src / href 改写成 `__ASSET__<path>__` sentinel；
 *   sentinel 由 ArticleRenderer 在运行时通过 import.meta.glob 解析到真实 URL，
 *   这样图片走 Vite 资产管线（自动 hash、自动 base URL），无需手动拷贝到 public/
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
} from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTICLES_DIR = join(ROOT, 'src', 'articles');
const OUTPUT_FILE = join(ROOT, 'src', 'generated', 'articles.ts');

interface RawFrontmatter {
  title?: string;
  date?: string | Date;
  tags?: string | string[];
  categories?: string | string[];
  keywords?: string | string[];
  excerpt?: string;
  photos?: unknown;
  cover?: string;
  published?: boolean;
}

interface CompiledArticle {
  slug: string;
  title: string;
  date: string;
  rawDate: string;
  tags: string[];
  categories: string[];
  keywords: string[];
  excerpt: string;
  cover?: string;
  published: boolean;
  html: string;
  readingTime: number;
  wordCount: number;
}

const IMAGE_EXT_RE = /\.(?:png|jpe?g|gif|svg|webp|avif|bmp)(?:\?.*)?$/i;
const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i;

marked.use({ gfm: true, breaks: true });

function walkMarkdown(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) {
      if (entry === 'images' || entry.startsWith('_') || entry.startsWith('.')) continue;
      out.push(...walkMarkdown(p));
    } else if (entry.endsWith('.md')) {
      out.push(p);
    }
  }
  return out;
}

function toStringArray(v: unknown): string[] {
  if (v == null || v === '') return [];
  if (Array.isArray(v)) {
    return v
      .flatMap((x) => toStringArray(x))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return String(v)
    .split(/[,，;；]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeDate(d: unknown): { iso: string; raw: string } {
  if (d instanceof Date && !isNaN(d.getTime())) {
    return { iso: d.toISOString(), raw: d.toISOString() };
  }
  const raw = d == null ? '' : String(d);
  if (raw) {
    // `2026-1-21 10:18:09` 不是严格 ISO 但替换分隔符后可解析
    const parsed = new Date(raw.replace(/-/g, '/'));
    if (!isNaN(parsed.getTime())) {
      return { iso: parsed.toISOString(), raw };
    }
  }
  return { iso: new Date().toISOString(), raw };
}

function parseCover(fm: RawFrontmatter): string | undefined {
  if (fm.cover) return String(fm.cover).replace(/^\.\//, '');
  if (fm.photos != null) {
    const first = Array.isArray(fm.photos) ? (fm.photos as unknown[])[0] : fm.photos;
    const path = Array.isArray(first) ? (first as unknown[])[0] : first;
    if (path) return String(path).replace(/^\.\//, '');
  }
  return undefined;
}

function buildSentinel(path: string): string {
  return `__ASSET__${path}__`;
}

function rewriteAssetUrls(html: string, articleRelDir: string): string {
  return html.replace(
    /(\s(?:src|href))=(["'])([^"']+)\2/gi,
    (match, attr: string, quote: string, url: string) => {
      if (
        ABSOLUTE_URL_RE.test(url) ||
        url.startsWith('#') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:') ||
        url.startsWith('data:') ||
        url.startsWith('__ASSET__')
      ) {
        return match;
      }
      const isImage = IMAGE_EXT_RE.test(url);
      // href 指向非图片资源不动（外链已经在上面被略过）
      if (attr.trim().toLowerCase() === 'href' && !isImage) return match;

      const cleaned = url.replace(/^\.\//, '');
      // marked 会把 markdown 语法 ![](./xxx) 里的非 ASCII 文件名 URL 编码，
      // 而 raw <img src="./xxx"> 不会。统一 decode 让 sentinel 始终是原始文件名，
      // 跟 Vite import.meta.glob 的 key 对得上。
      let decoded = cleaned;
      try {
        decoded = decodeURIComponent(cleaned);
      } catch {
        /* not a valid encoded URI, keep as-is */
      }
      const normalized = articleRelDir ? `${articleRelDir}/${decoded}` : decoded;
      return `${attr}=${quote}${buildSentinel(normalized)}${quote}`;
    },
  );
}

function countChars(text: string): number {
  return text.replace(/\s+/g, '').length;
}

function buildArticle(filePath: string): CompiledArticle {
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;

  const slug = basename(filePath, '.md');
  const articleRelDir = relative(ARTICLES_DIR, dirname(filePath)).replace(/\\/g, '/');

  const html = String(marked.parse(content));
  const rewrittenHtml = rewriteAssetUrls(html, articleRelDir);

  const cover = parseCover(fm);
  const rewrittenCover = cover
    ? buildSentinel(articleRelDir ? `${articleRelDir}/${cover}` : cover)
    : undefined;

  const { iso, raw: rawDate } = normalizeDate(fm.date);
  const chars = countChars(content);
  const readingTime = Math.max(1, Math.round(chars / 400)); // 中文约 400 字/分钟

  return {
    slug,
    title: fm.title ?? slug,
    date: iso,
    rawDate,
    tags: toStringArray(fm.tags),
    categories: toStringArray(fm.categories),
    keywords: toStringArray(fm.keywords),
    excerpt: fm.excerpt ?? '',
    cover: rewrittenCover,
    published: fm.published !== false,
    html: rewrittenHtml,
    readingTime,
    wordCount: chars,
  };
}

function main() {
  const files = walkMarkdown(ARTICLES_DIR);
  const articles = files
    .map(buildArticle)
    .filter((a) => a.published)
    .sort((a, b) => b.date.localeCompare(a.date));

  const banner = `// AUTO-GENERATED by scripts/build-articles.ts — do not edit by hand.
// run \`pnpm articles\` to regenerate.\n`;
  const types = `
export interface Article {
  slug: string;
  title: string;
  date: string;
  rawDate: string;
  tags: string[];
  categories: string[];
  keywords: string[];
  excerpt: string;
  cover?: string;
  published: boolean;
  html: string;
  readingTime: number;
  wordCount: number;
}
`;
  const body = `\nexport const articles: Article[] = ${JSON.stringify(
    articles,
    null,
    2,
  )};\n`;

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, `${banner}${types}${body}`);
  const rel = relative(ROOT, OUTPUT_FILE).replace(/\\/g, '/');
  console.log(`[articles] compiled ${articles.length} article(s) → ${rel}`);
  for (const a of articles) {
    console.log(`  · ${a.slug.padEnd(28)} ${a.rawDate}  ${a.title}`);
  }
}

main();
