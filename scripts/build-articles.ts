/**
 * 编译 src/articles/ 下的 markdown 为 src/generated/articles.ts。
 *
 * - frontmatter 用 gray-matter 解析
 * - 正文用 marked 转 HTML，允许 raw HTML 直通
 * - 本地图片 src / href 改写成 `__ASSET__<path>__` sentinel；
 *   sentinel 由 ArticleRenderer 在运行时通过 import.meta.glob 解析到真实 URL，
 *   这样图片走 Vite 资产管线（自动 hash、自动 base URL），无需手动拷贝到 public/
 * - 图片用 sharp 优化：resize 到 maxWidth 1600 + 转 webp(q82)，
 *   输出到 src/articles/_optimized/<相同相对路径>.webp（SVG 直通）。
 *   按 mtime 增量缓存，重跑只处理新增/改动。
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  statSync,
  existsSync,
  copyFileSync,
} from 'node:fs';
import { join, relative, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARTICLES_DIR = join(ROOT, 'src', 'articles');
const OPTIMIZED_DIR = join(ARTICLES_DIR, '_optimized');
const OUTPUT_FILE = join(ROOT, 'src', 'generated', 'articles.ts');

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;

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

/** 优化统计，用于打印总览 */
interface OptStats {
  processed: number;
  cached: number;
  skipped: number;
  failed: number;
  bytesIn: number;
  bytesOut: number;
}
const stats: OptStats = {
  processed: 0,
  cached: 0,
  skipped: 0,
  failed: 0,
  bytesIn: 0,
  bytesOut: 0,
};

/** 同一张图在一次构建里只跑一次 */
const optimizeCache = new Map<string, Promise<string>>();

/**
 * 把 ARTICLES_DIR 下相对路径的图片优化进 _optimized/。
 * 返回优化后的相对路径（仍相对 ARTICLES_DIR）。
 * - SVG: 直接 copy
 * - PNG/JPG/JPEG/GIF/BMP/WEBP/AVIF: resize + webp(q82)，输出同名 .webp
 * - 缓存：输出 mtime >= 源 mtime 时跳过 sharp
 */
function optimizeImage(originalRelPath: string): Promise<string> {
  const cached = optimizeCache.get(originalRelPath);
  if (cached) return cached;

  const task = (async (): Promise<string> => {
    const srcPath = join(ARTICLES_DIR, originalRelPath);
    if (!existsSync(srcPath)) {
      console.warn(`[articles] image not found: ${originalRelPath}`);
      stats.failed += 1;
      return originalRelPath;
    }

    const ext = extname(originalRelPath).toLowerCase();
    const isSvg = ext === '.svg';
    const baseName = basename(originalRelPath, extname(originalRelPath));
    const destRel = isSvg
      ? originalRelPath
      : join(dirname(originalRelPath), `${baseName}.webp`).replace(/\\/g, '/');
    const destPath = join(OPTIMIZED_DIR, destRel);

    const srcStat = statSync(srcPath);
    if (
      existsSync(destPath) &&
      statSync(destPath).mtimeMs >= srcStat.mtimeMs
    ) {
      stats.cached += 1;
      return destRel;
    }

    mkdirSync(dirname(destPath), { recursive: true });

    if (isSvg) {
      copyFileSync(srcPath, destPath);
      stats.processed += 1;
      stats.bytesIn += srcStat.size;
      stats.bytesOut += statSync(destPath).size;
      return destRel;
    }

    try {
      const pipeline = sharp(srcPath, { animated: ext === '.gif' || ext === '.webp' })
        .rotate() // 按 EXIF 自动转向
        .resize({
          width: MAX_WIDTH,
          withoutEnlargement: true,
        });
      await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(destPath);
      stats.processed += 1;
      stats.bytesIn += srcStat.size;
      stats.bytesOut += statSync(destPath).size;
      return destRel;
    } catch (err) {
      console.warn(
        `[articles] sharp failed for ${originalRelPath}: ${(err as Error).message}`,
      );
      stats.failed += 1;
      return originalRelPath;
    }
  })();

  optimizeCache.set(originalRelPath, task);
  return task;
}

async function rewriteAssetUrls(
  html: string,
  articleRelDir: string,
): Promise<string> {
  const re = /(\s(?:src|href))=(["'])([^"']+)\2/gi;
  const matches: {
    index: number;
    length: number;
    attr: string;
    quote: string;
    url: string;
  }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    matches.push({
      index: m.index,
      length: m[0].length,
      attr: m[1],
      quote: m[2],
      url: m[3],
    });
  }

  // 同步阶段：决定每条 URL 是否要替换、要替换成哪条相对路径
  const tasks: (Promise<string> | null)[] = matches.map(({ attr, url }) => {
    if (
      ABSOLUTE_URL_RE.test(url) ||
      url.startsWith('#') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('data:') ||
      url.startsWith('__ASSET__')
    ) {
      return null;
    }
    const isImage = IMAGE_EXT_RE.test(url);
    if (attr.trim().toLowerCase() === 'href' && !isImage) return null;

    const cleaned = url.replace(/^\.\//, '');
    let decoded = cleaned;
    try {
      decoded = decodeURIComponent(cleaned);
    } catch {
      /* keep as-is */
    }
    const normalized = articleRelDir ? `${articleRelDir}/${decoded}` : decoded;
    return optimizeImage(normalized);
  });

  const resolved = await Promise.all(
    tasks.map((t) => (t == null ? Promise.resolve(null) : t)),
  );

  // 从尾向头替换，避免影响 index
  let result = html;
  for (let i = matches.length - 1; i >= 0; i--) {
    const opt = resolved[i];
    if (!opt) continue;
    const { index, length, attr, quote } = matches[i];
    result =
      result.slice(0, index) +
      `${attr}=${quote}${buildSentinel(opt)}${quote}` +
      result.slice(index + length);
  }
  return result;
}

function countChars(text: string): number {
  return text.replace(/\s+/g, '').length;
}

async function buildArticle(filePath: string): Promise<CompiledArticle> {
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;

  const slug = basename(filePath, '.md');
  const articleRelDir = relative(ARTICLES_DIR, dirname(filePath)).replace(/\\/g, '/');

  const html = String(marked.parse(content));
  const rewrittenHtml = await rewriteAssetUrls(html, articleRelDir);

  const cover = parseCover(fm);
  let rewrittenCover: string | undefined;
  if (cover) {
    const coverRel = articleRelDir ? `${articleRelDir}/${cover}` : cover;
    const optimizedCover = await optimizeImage(coverRel);
    rewrittenCover = buildSentinel(optimizedCover);
  }

  const { iso, raw: rawDate } = normalizeDate(fm.date);
  const chars = countChars(content);
  const readingTime = Math.max(1, Math.round(chars / 400));

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

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const t0 = Date.now();
  const files = walkMarkdown(ARTICLES_DIR);
  const articles = (await Promise.all(files.map(buildArticle)))
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
  const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`[articles] compiled ${articles.length} article(s) → ${rel} in ${elapsed}s`);
  for (const a of articles) {
    console.log(`  · ${a.slug.padEnd(28)} ${a.rawDate}  ${a.title}`);
  }

  const totalImg = stats.processed + stats.cached + stats.failed;
  if (totalImg > 0) {
    const savedPct =
      stats.bytesIn > 0
        ? ((1 - stats.bytesOut / stats.bytesIn) * 100).toFixed(1)
        : '0';
    console.log(
      `[articles] images: ${stats.processed} processed, ${stats.cached} cached, ${stats.failed} failed`,
    );
    if (stats.processed > 0) {
      console.log(
        `[articles] sizes:  ${fmtBytes(stats.bytesIn)} → ${fmtBytes(stats.bytesOut)} (saved ${savedPct}%)`,
      );
    }
  }
}

main().catch((err) => {
  console.error('[articles] build failed:', err);
  process.exit(1);
});
