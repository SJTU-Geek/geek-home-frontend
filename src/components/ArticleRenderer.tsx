import { useEffect, useMemo, useRef } from 'react';
import './ArticleRenderer.css';

/**
 * 通过 Vite import.meta.glob 把 src/articles/_optimized/ 下所有图片打包，
 * 得到 文件名 → 资产 URL 的映射。
 *
 * _optimized/ 由 `pnpm articles` 阶段用 sharp 输出（resize + webp），
 * 跟原图保持镜像目录结构。Vite 会自动加 hash、自动尊重 base URL，
 * 不需要把图片复制到 public/。
 */
const assetModules = import.meta.glob(
  '../articles/_optimized/**/*.{webp,svg,png,PNG,SVG,WEBP}',
  { eager: true, import: 'default' },
) as Record<string, string>;

const assetMap: Record<string, string> = {};
for (const [key, url] of Object.entries(assetModules)) {
  // glob key 形如 '../articles/_optimized/images/foo.webp' →
  // sentinel 里保存的是 'images/foo.webp'，把前缀剥掉对齐
  const short = key.replace(/^\.\.\/articles\/_optimized\//, '');
  assetMap[short] = url;
}

const SENTINEL_RE = /__ASSET__([^"'<>\s]+?)__/g;

/** 把 HTML 中的 `__ASSET__<path>__` 替换成真实的 Vite 资产 URL */
export function resolveAssetSentinels(html: string): string {
  return html.replace(SENTINEL_RE, (_, path) => assetMap[path] ?? '');
}

/** 把单个 sentinel（用于 cover 等字段）解析成 URL */
export function resolveAsset(sentinel?: string): string | undefined {
  if (!sentinel) return undefined;
  const m = sentinel.match(/^__ASSET__(.+)__$/);
  if (!m) return sentinel;
  return assetMap[m[1]];
}

interface Props {
  html: string;
  className?: string;
}

/**
 * 渲染编译后的 markdown HTML。
 * 用 ref + innerHTML 而非 dangerouslySetInnerHTML 是因为我们在 effect 里
 * 还要做一些后处理：给外链 a 加 target=_blank、给所有 img 加 loading=lazy。
 */
export default function ArticleRenderer({ html, className = '' }: Props) {
  const resolved = useMemo(() => resolveAssetSentinels(html), [html]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    for (const a of el.querySelectorAll('a[href^="http"]')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
    for (const img of el.querySelectorAll<HTMLImageElement>('img')) {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    }
  }, [resolved]);

  return (
    <div
      ref={ref}
      className={`article-body ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: resolved }}
    />
  );
}
