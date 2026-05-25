import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { products, type Product, type ProductStatus } from '../data/products';
import { schedules } from '../data/schedule';
import './Products.css';

const STATUS_ORDER: ProductStatus[] = ['已发布', '测试中', '开发中', '策划中'];
const STATUS_TINT: Record<ProductStatus, string> = {
  已发布: '#43d9c1',
  测试中: '#ffc043',
  开发中: '#7aa6ff',
  策划中: '#c9151e',
};

type Filter = ProductStatus | 'all';

export default function Products() {
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      products.filter(
        (p) => !p.hidden && (filter === 'all' || p.status === filter),
      ),
    [filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const p of products) {
      if (p.hidden) continue;
      c.all += 1;
      c[p.status] = (c[p.status] || 0) + 1;
    }
    return c;
  }, []);

  return (
    <div className="products">
      {/* ============ HERO ============ */}
      <section className="products__hero">
        <div className="products__hero-grid" aria-hidden />
        <div className="container products__hero-inner">
          <p className="section-eyebrow">// 产品 · Products</p>
          <h1 className="products__title">
            <span className="glitch" data-text="核心项目矩阵">
              核心项目矩阵
            </span>
          </h1>
          <p className="products__desc">
            协会主导或参与的 {products.filter((p) => !p.hidden).length} 个核心项目，覆盖
            <span className="accent">校园成就</span>、
            <span className="accent">信息聚合</span>、
            <span className="accent">AI 智慧生态</span>、
            <span className="accent">校园文化</span>
            等方向。从已发布到策划中，构成一条持续演进的成果链。
          </p>

          <div className="products__filters" role="tablist">
            <FilterChip
              active={filter === 'all'}
              label="全部"
              count={counts.all}
              tint="#ffffff"
              onClick={() => setFilter('all')}
            />
            {STATUS_ORDER.map((s) => (
              <FilterChip
                key={s}
                active={filter === s}
                label={s}
                count={counts[s] || 0}
                tint={STATUS_TINT[s]}
                onClick={() => setFilter(s)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ 项目网格 ============ */}
      <section className="section products__grid-section">
        <div className="container">
          <div className="products__grid">
            {visible.map((p, i) => (
              <Reveal
                key={p.id}
                delay={Math.min(i * 60, 360)}
                className={`product-card-wrap ${openId === p.id ? 'is-open' : ''}`}
              >
                <ProductCard
                  product={p}
                  open={openId === p.id}
                  onToggle={() => setOpenId(openId === p.id ? null : p.id)}
                />
              </Reveal>
            ))}
            {visible.length === 0 && (
              <div className="products__empty">
                <p>// no projects in this status</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ ROADMAP / GANTT ============ */}
      <section className="section roadmap">
        <div className="container">
          <Reveal>
            <p className="section-eyebrow">// 执行排期 · Roadmap 2026</p>
            <h2 className="section-title">
              2026 · 项目<span className="accent">月度推进</span>{' '}
            </h2>
            <p className="roadmap__desc">
              当前已对外可见的核心项目排期。横向时间线展示了从需求调研到上线的全过程，
              鼠标悬停每一条任务可查看详细说明。
            </p>
          </Reveal>

          <Reveal delay={120}>
            <Gantt />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- FilterChip ---------- */
interface FilterChipProps {
  active: boolean;
  label: string;
  count: number;
  tint: string;
  onClick: () => void;
}
function FilterChip({ active, label, count, tint, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      className={`filter-chip ${active ? 'is-active' : ''}`}
      onClick={onClick}
      style={{ '--tint': tint } as React.CSSProperties}
    >
      <span className="filter-chip__label">{label}</span>
      <span className="filter-chip__count">{String(count).padStart(2, '0')}</span>
    </button>
  );
}

/* ---------- ProductCard ---------- */
interface ProductCardProps {
  product: Product;
  open: boolean;
  onToggle: () => void;
}
function ProductCard({ product, open, onToggle }: ProductCardProps) {
  const cover = product.images[0];
  return (
    <article
      className={`product-card corner ${open ? 'is-open' : ''}`}
      style={{ '--accent': product.accent } as React.CSSProperties}
    >
      <header className="product-card__head">
        <span
          className="product-card__status"
          style={{
            color: STATUS_TINT[product.status],
            borderColor: STATUS_TINT[product.status],
          }}
        >
          <span className="product-card__status-dot" />
          {product.status}
        </span>
        <span className="product-card__id">#{product.id}</span>
      </header>

      <div className="product-card__cover">
        {cover ? (
          <img src={cover} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card__cover-fallback" aria-hidden>
            <span>{product.subtitle?.[0] || product.name[0]}</span>
            <em>NO COVER</em>
          </div>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.subtitle && (
          <span className="product-card__sub">{product.subtitle}</span>
        )}
        <p className="product-card__tagline">{product.tagline}</p>

        <div className="product-card__tags">
          {product.tags.map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>

        {open && (
          <div className="product-card__detail">
            <div className="product-card__paragraphs">
              {product.description.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>

            {product.features.length > 0 && (
              <div className="product-card__features">
                <span className="product-card__features-title">
                  // 核心特色
                </span>
                <ul>
                  {product.features.map((f) => (
                    <li key={f.title}>
                      <span className="product-card__feat-title">{f.title}</span>
                      <span className="product-card__feat-detail">
                        {f.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.id === 'sjtu-wiki' && false && (
              <Link to="/products/wiki/contrib" className="product-card__cta">
                <span className="product-card__cta-label">// 参与即可获得积分</span>
                <span className="product-card__cta-text">
                  参与 SJTU Wiki 贡献，可获得"传承·交大"积分！
                </span>
                <span className="product-card__cta-arrow">进入贡献中心 →</span>
              </Link>
            )}

            {product.images.length > 1 && (
              <div className="product-card__gallery">
                {product.images.slice(1).map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" />
                ))}
              </div>
            )}
          </div>
        )}

        <footer className="product-card__foot">
          <button
            type="button"
            className="product-card__toggle"
            onClick={onToggle}
            aria-expanded={open}
          >
            {open ? '收起 ↑' : '查看详情 ↓'}
          </button>
          {product.url && (
            <a
              className="product-card__visit"
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              访问项目
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M2 8L8 2M8 2H3.5M8 2V6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}

/* ---------- Gantt ---------- */
function Gantt() {
  const { minMs, maxMs, total, months } = useMemo(() => {
    const allTasks = schedules.flatMap((s) => s.tasks);
    const starts = allTasks.map((t) => new Date(t.start).getTime());
    const ends = allTasks.map((t) => new Date(t.end).getTime());
    const minMs = Math.min(...starts);
    const maxMs = Math.max(...ends);
    const total = maxMs - minMs;

    const months: { date: Date; left: number }[] = [];
    const cursor = new Date(minMs);
    cursor.setDate(1);
    cursor.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= maxMs) {
      const left = ((cursor.getTime() - minMs) / total) * 100;
      months.push({ date: new Date(cursor), left });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return { minMs, maxMs, total, months };
  }, []);

  const accentMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of products) map[p.id] = p.accent;
    return map;
  }, []);

  const now = Date.now();
  const nowLeft =
    now >= minMs && now <= maxMs ? ((now - minMs) / total) * 100 : null;

  return (
    <div className="gantt-wrap">
      <div className="gantt" role="table">
        <div className="gantt__head">
          <div className="gantt__sidebar gantt__sidebar--head">2026 · 月度</div>
          <div className="gantt__track gantt__track--head">
            {months.map((m, i) => (
              <div
                key={i}
                className="gantt__month"
                style={{ left: `${m.left}%` }}
              >
                <span>{m.date.getMonth() + 1}月</span>
              </div>
            ))}
            {nowLeft !== null && (
              <div className="gantt__now" style={{ left: `${nowLeft}%` }}>
                <span>TODAY</span>
              </div>
            )}
          </div>
        </div>

        {schedules.map((s) => {
          const accent = accentMap[s.productId] || '#c9151e';
          return (
            <div className="gantt__group" key={s.productId}>
              <div
                className="gantt__group-head"
                style={{ '--accent': accent } as React.CSSProperties}
              >
                <span className="gantt__group-bar" aria-hidden />
                <span className="gantt__group-name">{s.productName}</span>
                <span className="gantt__group-count">
                  {s.tasks.length} 项
                </span>
              </div>

              {s.tasks.map((t, i) => {
                const start = new Date(t.start).getTime();
                const end = new Date(t.end).getTime();
                const left = ((start - minMs) / total) * 100;
                const width = Math.max(((end - start) / total) * 100, 1.5);
                return (
                  <div className="gantt__row" key={i}>
                    <div className="gantt__sidebar">
                      <span className="gantt__task-title">{t.title}</span>
                      <span className="gantt__task-date">
                        {fmt(t.start)} → {fmt(t.end)}
                      </span>
                    </div>
                    <div className="gantt__track">
                      {months.map((m, mi) => (
                        <div
                          key={mi}
                          className="gantt__gridline"
                          style={{ left: `${m.left}%` }}
                          aria-hidden
                        />
                      ))}
                      {nowLeft !== null && (
                        <div
                          className="gantt__now-line"
                          style={{ left: `${nowLeft}%` }}
                          aria-hidden
                        />
                      )}
                      <div
                        className="gantt__bar"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          '--accent': accent,
                        } as React.CSSProperties}
                        title={t.detail}
                      >
                        <span className="gantt__bar-label">{t.title}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="gantt__legend">
        {schedules.map((s) => {
          const accent = accentMap[s.productId] || '#c9151e';
          return (
            <span key={s.productId} className="gantt__legend-item">
              <span
                className="gantt__legend-swatch"
                style={{ background: accent }}
                aria-hidden
              />
              {s.productName}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function fmt(date: string) {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
}
