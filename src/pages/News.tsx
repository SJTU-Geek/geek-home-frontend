import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { resolveAsset } from '../components/ArticleRenderer';
import { articles } from '../generated/articles';
import './News.css';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function News() {
  const [tag, setTag] = useState<string>('all');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) for (const t of a.tags) set.add(t);
    return ['all', ...Array.from(set)];
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: articles.length };
    for (const a of articles) for (const t of a.tags) c[t] = (c[t] || 0) + 1;
    return c;
  }, []);

  const visible = useMemo(() => {
    if (tag === 'all') return articles;
    return articles.filter((a) => a.tags.includes(tag));
  }, [tag]);

  return (
    <div className="news">
      {/* ============ HERO ============ */}
      <section className="news__hero">
        <div className="news__hero-grid" aria-hidden />
        <div className="container news__hero-inner">
          <p className="section-eyebrow">// 新闻 · News</p>
          <h1 className="news__title">
            <span className="glitch" data-text="协会动态">
              协会动态
            </span>
          </h1>
          <p className="news__desc">
            协会主导的产品上新、活动回顾、招新公告与思考记录。共{' '}
            <span className="accent">{articles.length}</span> 篇文章。
          </p>

          {allTags.length > 1 && (
            <div className="news__filters">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`filter-chip ${tag === t ? 'is-active' : ''}`}
                  onClick={() => setTag(t)}
                  style={{ '--tint': '#c9151e' } as React.CSSProperties}
                >
                  <span className="filter-chip__label">
                    {t === 'all' ? '全部' : t}
                  </span>
                  <span className="filter-chip__count">
                    {String(counts[t] ?? 0).padStart(2, '0')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ 文章列表 ============ */}
      <section className="section news__list-section">
        <div className="container">
          {visible.length === 0 ? (
            <div className="news__empty">
              <p>// no articles in this tag</p>
            </div>
          ) : (
            <div className="news__list">
              {visible.map((a, i) => (
                <Reveal
                  key={a.slug}
                  delay={Math.min(i * 80, 320)}
                  className="news-card-wrap"
                >
                  <ArticleCard
                    slug={a.slug}
                    title={a.title}
                    date={a.date}
                    excerpt={a.excerpt}
                    tags={a.tags}
                    readingTime={a.readingTime}
                    cover={a.cover}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ArticleCardProps {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
  cover?: string;
}

function ArticleCard({
  slug,
  title,
  date,
  excerpt,
  tags,
  readingTime,
  cover,
}: ArticleCardProps) {
  const coverUrl = resolveAsset(cover);
  return (
    <Link to={`/news/${slug}`} className="news-card corner">
      <div className="news-card__cover">
        {coverUrl ? (
          <img src={coverUrl} alt={title} loading="lazy" />
        ) : (
          <div className="news-card__cover-fallback" aria-hidden>
            <span>NEWS</span>
          </div>
        )}
        <span className="news-card__date">{formatDate(date)}</span>
      </div>

      <div className="news-card__body">
        <h2 className="news-card__title">{title}</h2>
        {excerpt && <p className="news-card__excerpt">{excerpt}</p>}

        <div className="news-card__meta">
          <div className="news-card__tags">
            {tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
          <span className="news-card__reading">
            {readingTime} min read
          </span>
        </div>

        <span className="news-card__more">
          阅读全文
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6H10M10 6L6 2M10 6L6 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
