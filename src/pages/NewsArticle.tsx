import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArticleRenderer, { resolveAsset } from '../components/ArticleRenderer';
import { articles } from '../generated/articles';
import './NewsArticle.css';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();

  const { article, prev, next } = useMemo(() => {
    const idx = articles.findIndex((a) => a.slug === slug);
    if (idx < 0) return { article: null, prev: null, next: null };
    return {
      article: articles[idx],
      prev: idx + 1 < articles.length ? articles[idx + 1] : null,
      next: idx - 1 >= 0 ? articles[idx - 1] : null,
    };
  }, [slug]);

  if (!article) {
    return (
      <div className="news-article news-article--missing">
        <div className="container">
          <p className="section-eyebrow">// 404 · ARTICLE NOT FOUND</p>
          <h1>找不到这篇文章</h1>
          <p className="news-article__missing-desc">
            slug 为 <code>{slug}</code> 的文章不存在，可能已下线或被重命名。
          </p>
          <Link to="/news" className="btn btn--ghost">
            ← 返回新闻列表
          </Link>
        </div>
      </div>
    );
  }

  const coverUrl = resolveAsset(article.cover);

  return (
    <div className="news-article">
      <section className="news-article__hero">
        {coverUrl && (
          <div
            className="news-article__hero-bg"
            style={{ backgroundImage: `url(${coverUrl})` }}
            aria-hidden
          />
        )}
        <div className="news-article__hero-overlay" aria-hidden />
        <div className="container news-article__hero-inner">
          <Link to="/news" className="news-article__back">
            ← 所有文章
          </Link>

          <div className="news-article__meta">
            <span className="news-article__date">{formatDate(article.date)}</span>
            {article.tags.map((t) => (
              <span key={t} className="news-article__tag">
                #{t}
              </span>
            ))}
            <span className="news-article__reading">
              {article.readingTime} min · {article.wordCount} 字
            </span>
          </div>

          <h1 className="news-article__title">{article.title}</h1>
          {article.excerpt && (
            <p className="news-article__excerpt">{article.excerpt}</p>
          )}
        </div>
      </section>

      <section className="section news-article__body-section">
        <div className="container news-article__container">
          <ArticleRenderer html={article.html} />

          <div className="news-article__footer">
            <div className="news-article__nav">
              {prev ? (
                <Link to={`/news/${prev.slug}`} className="news-article__nav-card">
                  <span className="news-article__nav-label">← 上一篇 / older</span>
                  <span className="news-article__nav-title">{prev.title}</span>
                </Link>
              ) : (
                <div className="news-article__nav-card is-empty">
                  <span className="news-article__nav-label">没有更早的文章</span>
                </div>
              )}
              {next ? (
                <Link
                  to={`/news/${next.slug}`}
                  className="news-article__nav-card news-article__nav-card--next"
                >
                  <span className="news-article__nav-label">下一篇 / newer →</span>
                  <span className="news-article__nav-title">{next.title}</span>
                </Link>
              ) : (
                <div className="news-article__nav-card is-empty">
                  <span className="news-article__nav-label">已经是最新一篇</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
